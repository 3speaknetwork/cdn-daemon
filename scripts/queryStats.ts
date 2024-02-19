import { MongoClient } from 'mongodb'
import convertArrayToCSV from 'convert-array-to-csv'

void (async () => {
  const MONGO_HOST = 'localhost:27017'
  const url = `mongodb://${MONGO_HOST}`
  const mongo = new MongoClient(url)
  await mongo.connect()
  const db = mongo.db('spk-cdn-daemon')

  const col = db.collection('dhtRecords')

  const uniqueHashes = await col.distinct('ipfsHash')
  const peerIds = await col.distinct('peer_id')
  //console.log(peerIds)

  let outLet = []
  for (let peerId of peerIds) {
    const c = await col.count({
      peer_id: peerId,
    })
    outLet.push({ peer_id: peerId, count: c })
  }
  outLet = outLet.sort((e, b) => b.count - e.count)

  console.log(`### Sample Size: ${uniqueHashes.length}`)
  outLet = outLet.map((e) => {
    return {
      peer_id: e.peer_id,
      count: e.count,
      percentage: `(${Math.round((e.count / uniqueHashes.length) * 100)}%)`,
    }
  })
  const csv = convertArrayToCSV(outLet, {
    header: ['peer_id', 'count', 'percentage'],
  })
  console.log(csv)

  process.exit(0)
})()
