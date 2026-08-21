import Ajv from 'ajv';

// Import schemas (will be created next)
import { barSchema } from './bar.schema';
import { circularSchema } from './circular.schema';
import { linearSchema } from './linear.schema';
import { directionalSchema } from './directional.schema';
import { pieSchema } from './pie.schema';
import { bloodRelationSchema } from './bloodRelation.schema';
import { lineSchema } from './line.schema';
import { vennSchema } from './venn.schema';

const schemaMap = {
  bar: barSchema,
  circular: circularSchema,
  linear: linearSchema,
  directional: directionalSchema,
  pie: pieSchema,
  bloodRelation: bloodRelationSchema,
  line: lineSchema,
  venn: vennSchema
};

const ajv = new Ajv({ allErrors: true });

export function validateDiagram(data) {
  const type = data.type;
  const schema = schemaMap[type];
  
  if (!schema) {
    return {
      valid: false,
      errors: [`Unsupported diagram type: "${type}". Supported types: ${Object.keys(schemaMap).join(', ')}`]
    };
  }

  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  if (!valid) {
    return {
      valid: false,
      errors: validate.errors.map(err => {
        const path = err.instancePath || '';
        const message = err.message || 'invalid';
        return `${path} ${message}`.trim();
      })
    };
  }
  
  return { valid: true, errors: [] };
}

export function getSchema(type) {
  return schemaMap[type];
}

export function getSupportedTypes() {
  return Object.keys(schemaMap);
}