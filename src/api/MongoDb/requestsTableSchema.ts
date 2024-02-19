export const validatorSchema = {
  bsonType: 'object',

  properties: {
    url: {
      bsonType: 'string',
    },
    ip: {
      bsonType: 'string',
    },
    fetchedDataSize: {
      bsonType: 'number',
    },
    uploadDataSize: {
      bsonType: 'number',
    },
    headers: {
      bsonType: 'string',
    },
    cacheControl: {
      bsonType: 'string',
      optional: true,
    },
    timeTaken: {
      bsonType: 'number',
    },
    status: {
      bsonType: 'number',
    },
  },
}
