export const pieSchema = {
  type: 'object',
  required: ['type', 'data'],
  additionalProperties: true,
  properties: {
    type: {
      type: 'string',
      const: 'pie'
    },
    width: {
      type: 'number',
      minimum: 200,
      maximum: 2000,
      default: 800
    },
    height: {
      type: 'number',
      minimum: 200,
      maximum: 2000,
      default: 600
    },
    data: {
      type: 'array',
      minItems: 1,
      maxItems: 50,
      items: {
        type: 'object',
        required: ['label', 'value'],
        properties: {
          label: {
            type: 'string',
            minLength: 1,
            maxLength: 50
          },
          value: {
            type: 'number',
            minimum: 0
          },
          color: {
            type: 'string',
            pattern: '^#[0-9a-fA-F]{6}$'
          }
        }
      }
    },
    options: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          maxLength: 100
        },
        colors: {
          type: 'array',
          items: {
            type: 'string',
            pattern: '^#[0-9a-fA-F]{6}$'
          },
          minItems: 1
        },
        showPercentages: {
          type: 'boolean',
          default: true
        },
        showLabels: {
          type: 'boolean',
          default: true
        },
        innerRadius: {
          type: 'number',
          minimum: 0,
          maximum: 0.9,
          default: 0
        },
        labelPosition: {
          type: 'string',
          enum: ['inside', 'outside', 'both'],
          default: 'outside'
        },
        sortSlices: {
          type: 'boolean',
          default: false
        }
      },
      default: {}
    }
  }
};