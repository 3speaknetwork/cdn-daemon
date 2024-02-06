## Tasks did on 30 Jan 2024

- Meeting with vaultec
- Cloned cdn-daemon repo
- Installed docker and wsl
- Setup minio locally
- Store image on minio
- Retrieval of image
- Generalize to any object type
- Retrieval with custom extension (jpeg, png, and webp)
- Custom resolution crop
- Custom resolution

// detect mime type based upon file header not extensions
// s3 cache
// cdn-daemon functions overview
// https://github.com/openhive-network/imagehoster overview - use crop and other functions - some library

## Tasks did on 31 Jan 2024

nest js get started
postman installation
update packages
re-installed docker
postman installation

tried

- lazy imports
- cids library
- kubo client
- ipfs-http-client
- converting entire imports to require
- changing ts-config file
- new import version of importing cid from multi-formats

## Tasks did on 1st Feb 2024

Built resizer in cdn-daemon

3 hours spent on ffmpeg and fluent-ffmpeg npm libraries

### attempt with fluent-ffmpeg

```typescript
import ffmpeg from 'fluent-ffmpeg'
async function transcodeVideo(inputPath, outputPath, options = {}) {
  try {
    // return
    let video = ffmpeg(inputPath)
      .on('start', function (commandLine) {
        console.log('Spawned Ffmpeg with command: ' + commandLine)
      })
      .on('error', function (err, stdout, stderr) {
        console.log('Cannot process video: ' + err.message)
      })
      .save('output.mp4')
    // .save()

    // .run()
    console.log(video.size)
    return
    video
      .size('640x480')
      .fps(29.7)
      .audioCodec('libmp3lame')
      .audioBitrate(128)
      .audioCodec('libmp3lame')
      .format('flv')
      .on('error', function (err) {
        console.error('Error during transcoding:', err.message)
      })
      .on('end', function () {
        console.log('Video transcoded successfully:')
      })
      .save('output.flv')
  } catch (error) {
    console.error('Error during transcoding:', error.message)
  }
}

const someCustomSettingObject = {
  // videoCodec: 'mpeg4',
  videoFormat: 'webm',
  videoSize: '1280x720',
  videoBitrate: 2000,
  audioCodec: 'libopus',
  audioBitrate: 128,
  // Add other desired settings here
}

transcodeVideo('input.mp4', 'output.mp4', someCustomSettingObject)
```

#### error

spawn Uknown

### attempt with ffmpeg

```typescript
import ffmpeg from 'fluent-ffmpeg'
async function transcodeVideo(inputPath, outputPath, options = {}) {
  try {
    // return
    let video = ffmpeg(inputPath)
      .on('start', function (commandLine) {
        console.log('Spawned Ffmpeg with command: ' + commandLine)
      })
      .on('error', function (err, stdout, stderr) {
        console.log('Cannot process video: ' + err.message)
      })
      .save('output.mp4')
    // .save()

    // .run()
    console.log(video.size)
    return
    video
      .size('640x480')
      .fps(29.7)
      .audioCodec('libmp3lame')
      .audioBitrate(128)
      .audioCodec('libmp3lame')
      .format('flv')
      .on('error', function (err) {
        console.error('Error during transcoding:', err.message)
      })
      .on('end', function () {
        console.log('Video transcoded successfully:')
      })
      .save('output.flv')
  } catch (error) {
    console.error('Error during transcoding:', error.message)
  }
}

const someCustomSettingObject = {
  // videoCodec: 'mpeg4',
  videoFormat: 'webm',
  videoSize: '1280x720',
  videoBitrate: 2000,
  audioCodec: 'libopus',
  audioBitrate: 128,
  // Add other desired settings here
}

transcodeVideo('input.mp4', 'output.mp4', someCustomSettingObject)
```

#### error

Potentially unhandled rejection [1] {"code":104,"msg":"The format \"$s\" is not supported by the version of ffmpeg mp4"} (WARNING: non-Error used)












# minio commands ;

minio server C:\minio --console-address :9001

mc.exe alias set local http://127.0.0.1:9000 minioadmin minioadmin

### Task :

Image resizing
-- Customizable resolution
-- Store cached images to S3 or Mongodb GridFs . Mongodb GridFs generally preferred, but S3 is good alternative.
-- Return as jpeg, png, and webp
-- No cache options & cache control

Video transcoding
-- Use ffmpeg to remux different video formats. Such as mkv -> mp4, etc
-- Transcode status should be stored in database
-- API should return transcode status and once complete start serving the transcoded video
-- Transcoded video should be cached in S3/Mongodb GridFs
-- The transcoding should not change resolution or do any highly intensive video encode/deocde options if possible.

Documentation
-- Swagger API documentation built in to the project. Use that to document how all of these APIs

Whitepaper: https://peakd.com/hive/@spknetwork/spk-network-light-paper
https://min.io/
minio:
image: minio/minio:RELEASE.2019-08-14T20-37-41Z
networks: - acela-core
ports: - "127.0.0.1:9000:9000"
volumes: - "./data/s3-uploads:/data/"
environment:
MINIO_ACCESS_KEY: AKIAIOSFODNN7EXAMPLE
MINIO_SECRET_KEY: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
