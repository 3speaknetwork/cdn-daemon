import { MongoClient } from 'mongodb'
import { validatorSchema } from '../MongoDb/requestsTableSchema'
const MONGO_HOST = 'localhost:27017'
const url = `mongodb://127.0.0.1:27017`
const mongo = new MongoClient(url)

export async function statsLoggerMiddleware(object: any) {
  try {
    console.log('object to log is ', object)
    await mongo.connect()
    const db = mongo.db('spk-cdn-daemon')

    console.log('Collection created with schema validation!')
    let collection = db.collection('requestStats')
    collection
      .insertOne(object)
      .then(() => {
        console.log('Data inserted successfully!')
        // mongo.close() // Close connection after successful insertion
      })
      .catch((error) => {
        console.log('Error inserting data:', error)
        // mongo.close() // Close connection even on error
      })
    // mongo.close()
  } catch (error) {
    console.log('error in logging ', error)
  }
}
