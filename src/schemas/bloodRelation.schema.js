export const bloodRelationSchema = {
  type: 'object',
  required: ['type', 'data'],
  additionalProperties: true,
  properties: {
    type: {
      type: 'string',
      const: 'bloodRelation'
    },
    width: {
      type: 'number',
      minimum: 200,
      maximum: 2000,
      default: 1000
    },
    height: {
      type: 'number',
      minimum: 200,
      maximum: 2000,
      default: 700
    },
    data: {
      type: 'object',
      required: ['persons', 'relationships'],
      properties: {
        persons: {
          type: 'array',
          minItems: 1,
          maxItems: 100,
          items: {
            type: 'object',
            required: ['id', 'name'],
            properties: {
              id: {
                type: ['string', 'number']
              },
              name: {
                type: 'string',
                minLength: 1,
                maxLength: 50
              },
              gender: {
                type: 'string',
                enum: ['male', 'female', 'unknown'],
                default: 'unknown'
              },
              generation: {
                type: 'number',
                minimum: 0,
                maximum: 20
              },
              color: {
                type: 'string',
                pattern: '^#[0-9a-fA-F]{6}$'
              },
              bio: {
                type: 'string',
                maxLength: 200
              },
              title: {
                type: 'string',
                maxLength: 30
              }
            }
          }
        },
        relationships: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['type', 'from', 'to'],
            properties: {
              type: {
                type: 'string',
                enum: ['parent', 'spouse', 'child', 'sibling', 'cousin'],
                default: 'parent'
              },
              from: {
                type: ['string', 'number']
              },
              to: {
                type: ['string', 'number']
              },
              label: {
                type: 'string',
                maxLength: 20
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
        nodeWidth: {
          type: 'number',
          minimum: 60,
          maximum: 150,
          default: 90
        },
        nodeHeight: {
          type: 'number',
          minimum: 40,
          maximum: 80,
          default: 55
        },
        showGender: {
          type: 'boolean',
          default: true
        },
        showTitles: {
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
        spacingX: {
          type: 'number',
          minimum: 20,
          maximum: 100,
          default: 50
        },
        spacingY: {
          type: 'number',
          minimum: 30,
          maximum: 120,
          default: 70
        },
        showBio: {
          type: 'boolean',
          default: false
        },
        connectorStyle: {
          type: 'string',
          enum: ['straight', 'curved', 'orthogonal'],
          default: 'orthogonal'
        }
      },
      default: {}
    }
  }
};