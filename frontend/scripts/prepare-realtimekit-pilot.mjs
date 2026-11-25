// Explicit isolated-staging build step only. Downloads the official pinned npm tarball;
// npm lifecycle scripts are disabled. No application credentials or production data are required.
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
const version="2.1.0";
const temp=mkdtempSync(join(tmpdir(),"sq-rtk-"));
try{
 const output=execFileSync("npm",["pack","@cloudflare/realtimekit@"+version,"--ignore-scripts","--json","--pack-destination",temp],{encoding:"utf8",cwd:temp,timeout:120000});
 const meta=JSON.parse(output)[0];
 if(meta.name!=="@cloudflare/realtimekit"||meta.version!==version||!/^cloudflare-realtimekit-2\.1\.0\.tgz$/.test(meta.filename)||!meta.integrity?.startsWith("sha512-"))throw Error("Unexpected SDK package metadata");
 const tgz=join(temp,meta.filename);
 if("sha512-"+createHash("sha512").update(readFileSync(tgz)).digest("base64")!==meta.integrity)throw Error("SDK tarball integrity mismatch");
 const bytes=execFileSync("tar",["-xOf",tgz,"package/dist/browser.js"],{maxBuffer:32*1024*1024});
 if(bytes.length<10000)throw Error("Unexpected SDK browser bundle");
 const target=resolve(fileURLToPath(new URL("../public/vendor/realtimekit-2.1.0/",import.meta.url)));
 mkdirSync(target,{recursive:true});writeFileSync(join(target,"browser.js"),bytes);
 writeFileSync(join(target,"manifest.json"),JSON.stringify({package:meta.name,version,tarballIntegrity:meta.integrity,browserSha256:createHash("sha256").update(bytes).digest("hex")},null,2)+"\n");
 console.log("Staged RealtimeKit "+version+" browser bundle. Review manifest and vendor licence before deploying staging.");
}finally{rmSync(temp,{recursive:true,force:true});}
