import axios from 'axios'

let baseUri = 'http://localhost:18081/video/resizer/'

export async function estimateTransformation(url: string): Promise<number> {
  try {
    console.log('Uploading Video....')

    let time1 = Date.now() / 1000
    const base64EncodedUrl: string = Buffer.from(url).toString('base64')

    const response = await axios.get(baseUri + base64EncodedUrl + '?format=webm&cacheControl=cache')
    let time2 = Date.now() / 1000
    console.log('Video Uploaded in ' + (time2 - time1).toString(), ' seconds')

    return time2 - time1
  } catch (error) {
    console.error('Error checking HLS file:', error)
    return 0
  }
}

async function runTests() {
  let responses = []
  let responseTimes = []
  let url_480p, url_720p, url_1080p, videoTime, responseTime, uploadTimes

  /** Test 1 */
  url_480p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmWVqFM6i16zzBjDW6EZbPEoLLjHeTUiimyY9bXjHVCpzE/480p/index.m3u8'
  url_720p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmWVqFM6i16zzBjDW6EZbPEoLLjHeTUiimyY9bXjHVCpzE/720p/index.m3u8'
  url_1080p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmWVqFM6i16zzBjDW6EZbPEoLLjHeTUiimyY9bXjHVCpzE/1080p/index.m3u8'
  videoTime = 27 // seconds

  uploadTimes = {
    videoTime: videoTime,
  }

  responseTime = await estimateTransformation(url_480p)
  uploadTimes['480p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_720p)
  uploadTimes['720p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_1080p)
  uploadTimes['1080p'] = responseTime + ' seconds'

  console.log(uploadTimes)
  responseTimes.push(uploadTimes)

  /** Test 2 */
  url_480p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmSDDkZ9k2U4i64Pnxkg2SDBExh4V39WMiievVV5nuVZRJ/480p/index.m3u8'
  url_720p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmSDDkZ9k2U4i64Pnxkg2SDBExh4V39WMiievVV5nuVZRJ/720p/index.m3u8'
  url_1080p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmSDDkZ9k2U4i64Pnxkg2SDBExh4V39WMiievVV5nuVZRJ/1080p/index.m3u8'
  videoTime = 170 // seconds

  uploadTimes = {
    videoTime: videoTime,
  }

  responseTime = await estimateTransformation(url_480p)
  uploadTimes['480p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_720p)
  uploadTimes['720p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_1080p)
  uploadTimes['1080p'] = responseTime + ' seconds'

  console.log(uploadTimes)
  responseTimes.push(uploadTimes)

  /** Test 3 */
  url_480p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmYnYKrxFZif6xBfCDJv87iqenHsb7MXBUefqzpypeBbzk/480p/index.m3u8'
  url_720p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmYnYKrxFZif6xBfCDJv87iqenHsb7MXBUefqzpypeBbzk/720p/index.m3u8'
  url_1080p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmYnYKrxFZif6xBfCDJv87iqenHsb7MXBUefqzpypeBbzk/1080p/index.m3u8'
  videoTime = 292 // seconds

  uploadTimes = {
    videoTime: videoTime,
  }

  responseTime = await estimateTransformation(url_480p)
  uploadTimes['480p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_720p)
  uploadTimes['720p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_1080p)
  uploadTimes['1080p'] = responseTime + ' seconds'

  console.log(uploadTimes)
  responseTimes.push(uploadTimes)

  /** Test 4 */
  url_480p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmVuxWHF9aGJUHxLaYuLif2EwWZmVHgWA9c434aFoRQghm/480p/index.m3u8'
  url_720p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmVuxWHF9aGJUHxLaYuLif2EwWZmVHgWA9c434aFoRQghm/720p/index.m3u8'
  url_1080p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmVuxWHF9aGJUHxLaYuLif2EwWZmVHgWA9c434aFoRQghm/1080p/index.m3u8'
  videoTime = 385 // seconds

  uploadTimes = {
    videoTime: videoTime,
  }

  responseTime = await estimateTransformation(url_480p)
  uploadTimes['480p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_720p)
  uploadTimes['720p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_1080p)
  uploadTimes['1080p'] = responseTime + ' seconds'

  console.log(uploadTimes)
  responseTimes.push(uploadTimes)

  /** Test 5 */
  url_480p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmQvdUBwiEzxMMmx7mnKHfkscgoBDNyRxGFQNEouZ25meU/480p/index.m3u8'
  url_720p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmQvdUBwiEzxMMmx7mnKHfkscgoBDNyRxGFQNEouZ25meU/720p/index.m3u8'
  url_1080p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmQvdUBwiEzxMMmx7mnKHfkscgoBDNyRxGFQNEouZ25meU/1080p/index.m3u8'
  videoTime = 471 // seconds

  uploadTimes = {
    videoTime: videoTime,
  }

  responseTime = await estimateTransformation(url_480p)
  uploadTimes['480p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_720p)
  uploadTimes['720p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_1080p)
  uploadTimes['1080p'] = responseTime + ' seconds'

  console.log(uploadTimes)
  responseTimes.push(uploadTimes)

  /** Test 6 */
  url_480p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmcKneLto83zX87nZmJr3rztc3wgYL3hSDbjhQ2x2nPxbT/480p/index.m3u8'
  url_720p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmcKneLto83zX87nZmJr3rztc3wgYL3hSDbjhQ2x2nPxbT/720p/index.m3u8'
  url_1080p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmcKneLto83zX87nZmJr3rztc3wgYL3hSDbjhQ2x2nPxbT/1080p/index.m3u8'
  videoTime = 721 // seconds

  uploadTimes = {
    videoTime: videoTime,
  }

  responseTime = await estimateTransformation(url_480p)
  uploadTimes['480p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_720p)
  uploadTimes['720p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_1080p)
  uploadTimes['1080p'] = responseTime + ' seconds'

  console.log(uploadTimes)
  responseTimes.push(uploadTimes)

  /** Test 7 */
  url_480p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmcKwehxaYBThjBjajCXFDhdaSQ7Kfzb1se4F5T6HwDEY2/480p/index.m3u8'
  url_720p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmcKwehxaYBThjBjajCXFDhdaSQ7Kfzb1se4F5T6HwDEY2/720p/index.m3u8'
  url_1080p =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmcKwehxaYBThjBjajCXFDhdaSQ7Kfzb1se4F5T6HwDEY2/1080p/index.m3u8'
  videoTime = 1091 // seconds

  uploadTimes = {
    videoTime: videoTime,
  }

  responseTime = await estimateTransformation(url_480p)
  uploadTimes['480p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_720p)
  uploadTimes['720p'] = responseTime + ' seconds'
  responseTime = await estimateTransformation(url_1080p)
  uploadTimes['1080p'] = responseTime + ' seconds'

  console.log(uploadTimes)
  responseTimes.push(uploadTimes)

  // Log the response times
  console.log(responseTimes)
}
runTests()
