export const linearSchema = {
  type: 'object',
  required: ['type', 'data'],
  additionalProperties: true,
  properties: {
    type: {
      type: 'string',
      const: 'linear'
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
      default: 400
    },
    data: {
      type: 'object',
      required: ['nodes'],
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
              value: {
                type: 'number',
                minimum: 0
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
                enum: ['direct', 'arrow', 'dashed'],
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
        orientation: {
          type: 'string',
          enum: ['horizontal', 'vertical'],
          default: 'horizontal'
        },
        spacing: {
          type: 'number',
          minimum: 30,
          maximum: 200,
          default: 80
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
        labelPosition: {
          type: 'string',
          enum: ['top', 'bottom', 'left', 'right', 'center'],
          default: 'bottom'
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
        },
        showValues: {
          type: 'boolean',
          default: false
        }
      },
      default: {}
    }
  }
};