# CDN Daemon Documentation

Here the APIs we provide for easily manipulating the IPFS and Non-ipfs hosted content.

Here is the base baseURI for all the endpoints :

`baseURI="live_uri_of_cdn_daemon_backend"`

### Image Resizer API

This API aims to provide following functionalities:

- Transform image formats into desired ones.
- Return the transformed image as jpeg, png, and webp
- Updated image can be cached on our S3 storage.

#### URL Pattern:

- End Point : `/image/resizer/:base64EncodedUrl`
- `:base64EncodedUrl`: Base64-encoded URL of the image
- Query Parameters:
  - `format`: Desired image format (png, jpeg or webp etc. )
  - `cacheControl`: Cache control (e.g., `no-cache`)

Note that the cacheControl parameter is ignored when retrieving the content from IPFS
( IPFS content is always cached ).

#### Example Usage:

```javascript
const url = 'https://www.example.com/image.jpg' // Replace with the actual image URL
const base64EncodedUrl = Buffer.from(url).toString('base64')
const response = await axios.get(
  `${baseUri}/image/resizer/${base64EncodedUrl}?format=webp&cacheControl=no-cache`,
)
```

### Video Resizer API

This API allows you to :

-- Use ffmpeg to remux different video formats. Such as mkv -> mp4, etc
-- API returns the updated version of the video.
-- Transcoded video can cached in S3 Storage.
-- The transcoding does not change resolution or do any highly intensive video encode/decode options.

#### URL Pattern:

- End Point : `/video/resizer/:base64EncodedUrl`
- `:base64EncodedUrl`: Base64-encoded URL of the video
- Query Parameters:
  - `format`: Desired video format (mp4, webm etc. )
  - `cacheControl`: Cache control (e.g., `no-cache`)

Note that the cacheControl parameter is ignored when retrieving the content from IPFS ( IPFS content is always cached ).

#### Example Usage:

```javascript
const url = 'https://www.example.com/video.mp4' // Replace with the actual video URL
const base64EncodedUrl = Buffer.from(url).toString('base64')
const response = await axios.get(
  `${baseUri}/video/resizer/${base64EncodedUrl}?format=webm&cacheControl=no-cache`,
)
```

### IPFS URL Pattern:

- IPFS URLs can be of different types:
  - `ipfs://:CID`
    - Example: `ipfs://bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4`
  - `https://cloudflare-ipfs.com/ipfs/:CID`
    - Example: `https://cloudflare-ipfs.com/ipfs/bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4`
  - `https://ipfs-3speak.b-cdn.net/ipfs/:CID/:filename`
    - Example: `https://ipfs-3speak.b-cdn.net/ipfs/Qmf1XukAoMdatAW9HPDZL6Gphrgzvew5Km3rzvHf194DmM/480p/index.m3u8`

### Note:

- Ensure that you replace `$baseURI` with the actual base URI when interacting with the live version of the API.
- Use the provided script to encode URLs to Base64 before making requests to the APIs.
- For both IPFS and non-IPFS URLs, the `cacheControl` query parameter can be used to control caching behavior.
- Supported types of encoding for image files are `['bmp', 'jpeg', 'gif', 'tiff', 'png']` and for video files , these are : `['mp4', 'webm', 'mkv']`
