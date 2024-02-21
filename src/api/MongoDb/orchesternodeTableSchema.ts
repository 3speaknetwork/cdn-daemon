const orchestralNodeSchema = {
  type: 'object',
  properties: {
    endpointName: { type: 'string' },
    address: { type: 'string' },
    did: { type: 'string' },
    stats: {
      type: 'object',
      properties: {
        throughput: { type: 'number' },
        upSpeed: { type: 'number' },
        downSpeed: { type: 'number' },
      },
      required: ['throughput', 'upSpeed', 'downSpeed'],
    },
    ipAddress: { type: 'string' },
    insertedAt: { type: 'number' },
  },
}

export default orchestralNodeSchema
