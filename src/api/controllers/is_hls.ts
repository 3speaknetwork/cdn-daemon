import axios from 'axios'

export async function isHLSFile(url: string): Promise<boolean> {
  try {
    const response = await axios.get(url)

    // Check if the response body starts with the HLS signature
    const responseBody: string = response.data
    const signature: string = responseBody.slice(0, 7) // Assuming '#EXTM3U' is the signature

    return signature === '#EXTM3U'
  } catch (error) {
    console.error('Error checking HLS file:', error)
    return false
  }
}

async function main() {
  // Example usage:
  const hlsUrl = 'https://threespeakvideo.b-cdn.net/imynodlu/480p.m3u8'
  // 'https://ipfs-3speak.b-cdn.net/ipfs/Qmf1XukAoMdatAW9HPDZL6Gphrgzvew5Km3rzvHf194DmM/1080p/index.m3u8'

  const isHLS = await isHLSFile(hlsUrl)

  console.log('Is HLS file:', isHLS)
}

// main()
