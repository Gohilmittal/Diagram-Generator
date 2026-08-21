export const circularSchema = {
  type: 'object',
  required: ['type', 'data'],
  additionalProperties: true,
  properties: {
    type: {
      type: 'string',
      const: 'circular'
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
      type: 'object',
      required: ['nodes'],
      properties: {
        nodes: {
          type: 'array',
          minItems: 2,
          maxItems: 100,
          items: {
            type: 'object',
            required: ['id', 'label'],
            properties: {
              id: {
                type: ['string', 'number']
              },
              label: {
                type: 'string',
                minLength: 1,
                maxLength: 50
              },
              size: {
                type: 'number',
                minimum: 10,
                maximum: 100,
                default: 40
              },
              color: {
                type: 'string',
                pattern: '^#[0-9a-fA-F]{6}$'
              },
              icon: {
                type: 'string'
              }
            }
          }
        },
        connections: {
          type: 'array',
          items: {
            type: 'object',
            required: ['from', 'to'],
            properties: {
              from: {
                type: ['string', 'number']
              },
              to: {
                type: ['string', 'number']
              },
              label: {
                type: 'string',
                maxLength: 30
              },
              type: {
                type: 'string',
                enum: ['direct', 'curved', 'dashed'],
                default: 'direct'
              }
            }
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
        radius: {
          type: 'number',
          minimum: 50,
          maximum: 400,
          default: 200
        },
        nodeSize: {
          type: 'number',
          minimum: 20,
          maximum: 80,
          default: 45
        },
        showLabels: {
          type: 'boolean',
          default: true
        },
        labelOffset: {
          type: 'number',
          minimum: 5,
          maximum: 30,
          default: 15
        },
        colors: {
          type: 'array',
          items: {
            type: 'string',
            pattern: '^#[0-9a-fA-F]{6}$'
          },
          minItems: 1
        },
        showConnections: {
          type: 'boolean',
          default: true
        },
        connectionColor: {
          type: 'string',
          pattern: '^#[0-9a-fA-F]{6}$',
          default: '#a0aec0'
        }
      },
      default: {}
    }
  }
};