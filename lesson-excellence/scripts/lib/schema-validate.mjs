// Minimal JSON Schema (2020-12 subset) validator. Dependency-free.
// Supports: type, enum, const, required, properties, additionalProperties(false),
// items, minItems, maxItems, uniqueItems, minLength, maxLength, pattern, minimum, maximum.
export function validateSchema(schema, data, path = "$", errors = []) {
  const t = typeOf(data);
  if (schema.const !== undefined && data !== schema.const) errors.push(`${path}: must equal ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(data)) errors.push(`${path}: must be one of ${schema.enum.join(", ")}`);
  if (schema.type) {
    const ok = schema.type === "integer" ? t === "number" && Number.isInteger(data) : t === schema.type;
    if (!ok) { errors.push(`${path}: expected ${schema.type}, got ${t}`); return errors; }
  }
  if (t === "string") {
    if (schema.minLength !== undefined && data.trim().length < schema.minLength) errors.push(`${path}: shorter than ${schema.minLength} chars`);
    if (schema.maxLength !== undefined && data.length > schema.maxLength) errors.push(`${path}: longer than ${schema.maxLength} chars`);
    if (schema.pattern && !new RegExp(schema.pattern).test(data)) errors.push(`${path}: does not match ${schema.pattern}`);
  }
  if (t === "number") {
    if (schema.minimum !== undefined && data < schema.minimum) errors.push(`${path}: below minimum ${schema.minimum}`);
    if (schema.maximum !== undefined && data > schema.maximum) errors.push(`${path}: above maximum ${schema.maximum}`);
  }
  if (t === "array") {
    if (schema.minItems !== undefined && data.length < schema.minItems) errors.push(`${path}: needs at least ${schema.minItems} item(s), has ${data.length}`);
    if (schema.maxItems !== undefined && data.length > schema.maxItems) errors.push(`${path}: allows at most ${schema.maxItems} item(s), has ${data.length}`);
    if (schema.uniqueItems && new Set(data.map((x) => JSON.stringify(x))).size !== data.length) errors.push(`${path}: items must be unique`);
    if (schema.items) data.forEach((item, i) => validateSchema(schema.items, item, `${path}[${i}]`, errors));
  }
  if (t === "object") {
    for (const key of schema.required || []) if (!(key in data)) errors.push(`${path}: missing required field '${key}'`);
    const props = schema.properties || {};
    for (const [key, value] of Object.entries(data)) {
      if (props[key]) validateSchema(props[key], value, `${path}.${key}`, errors);
      else if (schema.additionalProperties === false) errors.push(`${path}: unexpected field '${key}'`);
    }
  }
  return errors;
}

function typeOf(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}
