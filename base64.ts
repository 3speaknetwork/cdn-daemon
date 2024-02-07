// const url: string = 'https://www.example.com'

/*** image test  */

// ipfs

const url = 'ipfs://QmWiAWBd3QKwHBYnMdJJsEfNcAfrVYyscBXfQKYJU3VdYW'

// non ipfs

// const url =
//   'https://www.shutterstock.com/image-photo/just-beautiful-cute-smiling-baby-600nw-2144454063.jpg'

/*** video test  */

// ipfs

// const url = 'ipfs://QmcVh36RrKerCWNEQvLCyRWkXEwREwxbU6mPZKxobocfH6'

// non ipfs

// const url =
// 'https://assets.mixkit.co/videos/preview/mixkit-a-kid-in-skiing-gear-is-walking-on-the-snow-51712-large.mp4'
//   'https://assets.mixkit.co/videos/preview/mixkit-laughing-baby-on-bed-in-white-room-8566-large.mp4'

// Encode URL to Base64
const base64Encoded: string = Buffer.from(url).toString('base64')
console.log('Encoded:', base64Encoded)

// Decode Base64 to URL
const decodedUrl: string = Buffer.from(base64Encoded, 'base64').toString('utf-8')
console.log('Decoded:', decodedUrl)
