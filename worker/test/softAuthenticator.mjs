// A minimal software passkey (WebAuthn, ES256, attestation "none") so tests run the real SimpleWebAuthn verification.
import { createHash, webcrypto } from "node:crypto";

const b64u = (buf) => Buffer.from(buf).toString("base64url");
const sha256 = (data) => createHash("sha256").update(data).digest();

// ---- tiny CBOR encoder (unsigned/negative ints, byte strings, text strings, maps)
function head(major, n) {
  if (n < 24) return Buffer.from([(major << 5) | n]);
  if (n < 256) return Buffer.from([(major << 5) | 24, n]);
  if (n < 65536) return Buffer.from([(major << 5) | 25, n >> 8, n & 255]);
  const b = Buffer.alloc(5); b[0] = (major << 5) | 26; b.writeUInt32BE(n, 1); return b;
}
function cbor(v) {
  if (typeof v === "number") return v >= 0 ? head(0, v) : head(1, -1 - v);
  if (typeof v === "string") { const s = Buffer.from(v, "utf8"); return Buffer.concat([head(3, s.length), s]); }
  if (v instanceof Uint8Array) return Buffer.concat([head(2, v.length), Buffer.from(v)]);
  if (v instanceof Map) return Buffer.concat([head(5, v.size), ...[...v].flatMap(([k, x]) => [cbor(k), cbor(x)])]);
  throw new Error("cbor: unsupported value");
}

// WebCrypto ECDSA gives raw r||s; WebAuthn wants DER.
function derSignature(raw) {
  const int = (b) => { let i = 0; while (i < b.length - 1 && b[i] === 0) i++; b = b.subarray(i); return b[0] & 0x80 ? Buffer.concat([Buffer.from([0]), b]) : b; };
  const r = int(Buffer.from(raw.subarray(0, 32))), s = int(Buffer.from(raw.subarray(32)));
  const body = Buffer.concat([Buffer.from([2, r.length]), r, Buffer.from([2, s.length]), s]);
  return Buffer.concat([Buffer.from([0x30, body.length]), body]);
}

export async function createSoftAuthenticator() {
  const keys = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const jwk = await webcrypto.subtle.exportKey("jwk", keys.publicKey);
  const credId = webcrypto.getRandomValues(new Uint8Array(16));
  let counter = 0;

  const authData = (rpId, flags, attested) => {
    const c = Buffer.alloc(4); c.writeUInt32BE(counter);
    return Buffer.concat([sha256(rpId), Buffer.from([flags]), c, attested ?? Buffer.alloc(0)]);
  };
  const clientData = (type, challenge, origin) => Buffer.from(JSON.stringify({ type, challenge, origin, crossOrigin: false }));

  return {
    id: b64u(credId),
    /** Answers navigator.credentials.create() for the given options. */
    register(options, origin) {
      const cose = new Map([[1, 2], [3, -7], [-1, 1], [-2, Buffer.from(jwk.x, "base64url")], [-3, Buffer.from(jwk.y, "base64url")]]);
      const len = Buffer.alloc(2); len.writeUInt16BE(credId.length);
      const attested = Buffer.concat([Buffer.alloc(16), len, Buffer.from(credId), cbor(cose)]);
      const ad = authData(options.rp.id, 0x45, attested); // UP | UV | AT
      const att = cbor(new Map([["fmt", "none"], ["attStmt", new Map()], ["authData", ad]]));
      return {
        id: b64u(credId), rawId: b64u(credId), type: "public-key", clientExtensionResults: {}, authenticatorAttachment: "platform",
        response: { clientDataJSON: b64u(clientData("webauthn.create", options.challenge, origin)), attestationObject: b64u(att), transports: ["internal"] },
      };
    },
    /** Answers navigator.credentials.get() for the given options. */
    async authenticate(options, origin, rpId) {
      counter += 1;
      const ad = authData(rpId, 0x05); // UP | UV
      const cd = clientData("webauthn.get", options.challenge, origin);
      const sig = new Uint8Array(await webcrypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, keys.privateKey, Buffer.concat([ad, sha256(cd)])));
      return {
        id: b64u(credId), rawId: b64u(credId), type: "public-key", clientExtensionResults: {}, authenticatorAttachment: "platform",
        response: { clientDataJSON: b64u(cd), authenticatorData: b64u(ad), signature: b64u(derSignature(sig)) },
      };
    },
  };
}
