import axios from 'axios'

let baseUri = 'http://localhost:18081/video/resizer/'

export async function estimateTransformation(
  url: string,
  videoTimeInSeconds: number,
): Promise<string> {
  try {
    console.log('Uploading Video....')

    let time1 = Date.now() / 1000
    const base64EncodedUrl: string = Buffer.from(url).toString('base64')

    const response = await axios.get(baseUri + base64EncodedUrl + '?format=webm&cacheControl=cache')
    let time2 = Date.now() / 1000
    console.log('Video Uploaded !')

    let stats =
      ' videoTime : ' +
      videoTimeInSeconds.toString() +
      'seconds' +
      ' responseTime : ' +
      (time2 - time1).toString() +
      ' seconds'
    console.log(stats)

    return stats
  } catch (error) {
    console.error('Error checking HLS file:', error)
    return ''
  }
}

async function runTests() {
  let responses = []
  let url, videoTime, response

  /**                           Test 1                 */
  url = 'https://threespeakvideo.b-cdn.net/imynodlu/480p.m3u8'
  videoTime = 16 // seconds
  response = await estimateTransformation(url, videoTime)
  responses.push(response)

  /**                           Test 2                  */
  url =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmWVqFM6i16zzBjDW6EZbPEoLLjHeTUiimyY9bXjHVCpzE/480p/index.m3u8'
  videoTime = 27 // seconds
  response = await estimateTransformation(url, videoTime)
  responses.push(response)

  /**                           Test 3                  */
  url =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmSDDkZ9k2U4i64Pnxkg2SDBExh4V39WMiievVV5nuVZRJ/480p/index.m3u8'
  videoTime = 170 // seconds , 2:50 Minutes
  response = await estimateTransformation(url, videoTime)
  responses.push(response)

  /**                           Test 4                  */
  url =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmYnYKrxFZif6xBfCDJv87iqenHsb7MXBUefqzpypeBbzk/480p/index.m3u8'
  videoTime = 292 // seconds , 4:52 Minutes
  response = await estimateTransformation(url, videoTime)
  responses.push(response)

  /**                           Test 5                  */
  url =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmVuxWHF9aGJUHxLaYuLif2EwWZmVHgWA9c434aFoRQghm/480p/index.m3u8'
  videoTime = 385 // seconds , 6:25 Minutes
  response = await estimateTransformation(url, videoTime)
  responses.push(response)

  /**                           Test 6                  */
  url =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmQvdUBwiEzxMMmx7mnKHfkscgoBDNyRxGFQNEouZ25meU/480p/index.m3u8'
  videoTime = 471 // seconds , 7:51 Minutes
  response = await estimateTransformation(url, videoTime)
  responses.push(response)

  /**                           Test 7                  */
  url =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmcKneLto83zX87nZmJr3rztc3wgYL3hSDbjhQ2x2nPxbT/480p/index.m3u8'
  videoTime = 721 // seconds , 12:01 Minutes
  response = await estimateTransformation(url, videoTime)
  responses.push(response)

  /**                           Test 8                  */
  url =
    'https://ipfs-3speak.b-cdn.net/ipfs/QmcKwehxaYBThjBjajCXFDhdaSQ7Kfzb1se4F5T6HwDEY2/480p/index.m3u8'
  videoTime = 1091 // seconds , 18:11 Minutes
  response = await estimateTransformation(url, videoTime)
  responses.push(response)

  console.log(responses)
}
runTests()
