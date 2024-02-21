import { MongoClient, ObjectId } from 'mongodb'
import { validatorSchema } from '../MongoDb/requestsTableSchema'
import orchestralNodeSchema from '../MongoDb/orchesternodeTableSchema'
const MONGO_HOST = 'localhost:27017'
const url = `mongodb://127.0.0.1:27017`
const mongo = new MongoClient(url)

export async function statsLoggerMiddleware(object: any) {
  try {
    console.log('Inserting Query Statistics : ', object)
    await mongo.connect()
    const db = mongo.db('spk-cdn-daemon')

    // console.log('Collection created with schema validation!')
    let collection = db.collection('requestStats')
    collection
      .insertOne({ ...object, insertedAt: parseInt('' + new Date().getTime() / 1000) })
      .then(() => {
        console.log('Request Stats inserted successfully!')
        // mongo.close() // Close connection after successful insertion
      })
      .catch((error) => {
        console.log('Error inserting data:', error)
        // mongo.close() // Close connection even on error
      })
    // mongo.close()
  } catch (error) {
    console.log('error in Saving Request Stats ', error)
  }
}

export async function deleteStats(id: ObjectId): Promise<void> {
  try {
    await mongo.connect()
    const db = mongo.db('spk-cdn-daemon')

    const collection = db.collection('requestStats')

    const objectId = new ObjectId(id)

    const result = await collection.deleteOne({ _id: objectId })

    if (result.deletedCount === 1) {
      console.log('Data deleted successfully!')
    } else {
      console.log('Data not found for deletion.')
    }
  } catch (error) {
    console.error('Error deleting data:', error)
  } finally {
    // Close the connection after the operation
    await mongo.close()
  }
}

// Function to fetch records older than a given timestamp
export async function fetchRecordsOlderThan(timestamp: number) {
  try {
    await mongo.connect()
    const db = mongo.db('spk-cdn-daemon')
    const collection = db.collection('requestStats')

    const olderRecords = await collection.find({ insertedAt: { $lt: timestamp } }).toArray()

    return olderRecords
  } catch (error) {
    console.error('Error fetching older records:', error)
    throw error
  } finally {
    await mongo.close()
  }
}
