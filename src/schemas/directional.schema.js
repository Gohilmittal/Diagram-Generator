export const directionalSchema = {
  type: 'object',
  required: ['type', 'data'],
  additionalProperties: true,
  properties: {
    type: {
      type: 'string',
      const: 'directional'
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
      required: ['nodes', 'connections'],
      properties: {
        nodes: {
          type: 'array',
          minItems: 2,
          maxItems: 50,
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
              x: {
                type: 'number',
                minimum: 0
              },
              y: {
                type: 'number',
                minimum: 0
              },
              size: {
                type: 'number',
                minimum: 20,
                maximum: 80,
                default: 40
              },
              color: {
                type: 'string',
                pattern: '^#[0-9a-fA-F]{6}$'
              },
              shape: {
                type: 'string',
                enum: ['circle', 'rectangle', 'diamond', 'hexagon'],
                default: 'circle'
              }
            }
          }
        },
        connections: {
          type: 'array',
          minItems: 1,
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
              direction: {
                type: 'string',
                enum: ['forward', 'backward', 'bidirectional'],
                default: 'forward'
              },
              type: {
                type: 'string',
                enum: ['direct', 'curved', 'orthogonal'],
                default: 'direct'
              },
              color: {
                type: 'string',
                pattern: '^#[0-9a-fA-F]{6}$'
              },
              weight: {
                type: 'number',
                minimum: 1,
                maximum: 10,
                default: 1
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
        nodeSize: {
          type: 'number',
          minimum: 20,
          maximum: 80,
          default: 40
        },
        showLabels: {
          type: 'boolean',
          default: true
        },
        colors: {
          type: 'array',
          items: {
            type: 'string',
            pattern: '^#[0-9a-fA-F]{6}$'
          },
          minItems: 1
        },
        connectionColor: {
          type: 'string',
          pattern: '^#[0-9a-fA-F]{6}$',
          default: '#718096'
        },
        showArrows: {
          type: 'boolean',
          default: true
        },
        arrowSize: {
          type: 'number',
          minimum: 5,
          maximum: 20,
          default: 10
        },
        layout: {
          type: 'string',
          enum: ['auto', 'manual', 'tree', 'grid'],
          default: 'auto'
        },
        spacing: {
          type: 'number',
          minimum: 30,
          maximum: 200,
          default: 100
        }
      },
      default: {}
    }
  }
};