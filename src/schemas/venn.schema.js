export const vennSchema = {
  type: 'object',
  required: ['type', 'data'],
  additionalProperties: true,
  properties: {
    type: {
      type: 'string',
      const: 'venn'
    },
    width: {
      type: 'number',
      minimum: 200,
      maximum: 2000,
      default: 700
    },
    height: {
      type: 'number',
      minimum: 200,
      maximum: 2000,
      default: 600
    },
    data: {
      type: 'object',
      required: ['sets'],
      properties: {
        sets: {
          type: 'array',
          minItems: 2,
          maxItems: 3,
          items: {
            type: 'object',
            required: ['name'],
            properties: {
              name: {
                type: 'string',
                minLength: 1,
                maxLength: 30
              },
              color: {
                type: 'string',
                pattern: '^#[0-9a-fA-F]{6}$'
              },
              size: {
                type: 'number',
                minimum: 50,
                maximum: 200,
                default: 120
              }
            }
          }
        },
        regions: {
          type: 'object',
          properties: {
            '0': { type: 'string' },   // Outside all sets
            '1': { type: 'string' },   // Only set 1
            '2': { type: 'string' },   // Only set 2
            '3': { type: 'string' },   // Only set 3
            '12': { type: 'string' },  // Intersection of 1 and 2
            '13': { type: 'string' },  // Intersection of 1 and 3
            '23': { type: 'string' },  // Intersection of 2 and 3
            '123': { type: 'string' }  // Intersection of all 3
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
        showLabels: {
          type: 'boolean',
          default: true
        },
        showRegionLabels: {
          type: 'boolean',
          default: true
        },
        labelPosition: {
          type: 'string',
          enum: ['inside', 'outside'],
          default: 'inside'
        },
        opacity: {
          type: 'number',
          minimum: 0.1,
          maximum: 1,
          default: 0.6
        },
        strokeWidth: {
          type: 'number',
          minimum: 1,
          maximum: 5,
          default: 2
        }
      },
      default: {}
    }
  }
};