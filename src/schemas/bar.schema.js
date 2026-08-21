export const barSchema = {
  type: 'object',
  required: ['type', 'data'],
  additionalProperties: true,
  properties: {
    type: {
      type: 'string',
      const: 'bar'
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
      default: 500
    },
    data: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
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
            type: 'number'
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
        showValues: {
          type: 'boolean',
          default: true
        },
        horizontal: {
          type: 'boolean',
          default: false
        },
        barWidth: {
          type: 'number',
          minimum: 5,
          maximum: 100,
          default: 30
        },
        xLabel: {
          type: 'string',
          maxLength: 50
        },
        yLabel: {
          type: 'string',
          maxLength: 50
        }
      },
      default: {}
    }
  }
};