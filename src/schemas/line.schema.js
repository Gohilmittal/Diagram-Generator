export const lineSchema = {
  type: 'object',
  required: ['type', 'data'],
  additionalProperties: true,
  properties: {
    type: {
      type: 'string',
      const: 'line'
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
      type: 'object',
      required: ['series'],
      properties: {
        series: {
          type: 'array',
          minItems: 1,
          maxItems: 10,
          items: {
            type: 'object',
            required: ['name', 'points'],
            properties: {
              name: {
                type: 'string',
                minLength: 1,
                maxLength: 50
              },
              points: {
                type: 'array',
                minItems: 2,
                maxItems: 200,
                items: {
                  type: 'object',
                  required: ['x', 'y'],
                  properties: {
                    x: {
                      type: ['number', 'string']
                    },
                    y: {
                      type: 'number'
                    }
                  }
                }
              },
              color: {
                type: 'string',
                pattern: '^#[0-9a-fA-F]{6}$'
              }
            }
          }
        },
        labels: {
          type: 'array',
          items: {
            type: 'string'
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
        xLabel: {
          type: 'string',
          maxLength: 50
        },
        yLabel: {
          type: 'string',
          maxLength: 50
        },
        colors: {
          type: 'array',
          items: {
            type: 'string',
            pattern: '^#[0-9a-fA-F]{6}$'
          },
          minItems: 1
        },
        showPoints: {
          type: 'boolean',
          default: true
        },
        showLegend: {
          type: 'boolean',
          default: true
        },
        curveType: {
          type: 'string',
          enum: ['linear', 'monotone', 'step', 'basis'],
          default: 'monotone'
        },
        fillArea: {
          type: 'boolean',
          default: false
        }
      },
      default: {}
    }
  }
};