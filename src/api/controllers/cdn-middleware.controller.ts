import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Header,
  Response,
  StreamableFile,
  Res,
  Query,
} from '@nestjs/common'
import Jimp from 'jimp'
import fs from 'fs/promises'
import pkg from 'mmmagic'
const { Magic, MAGIC_MIME_TYPE } = pkg
//import {fileTypeFromBuffer} from 'file-type';
import filetype from 'magic-bytes.js'
import ffmpeg from 'fluent-ffmpeg'
import toBuffer from 'it-to-buffer'
import Sharp from 'sharp'
import { coreContainer } from '../api.module'
const magic = new Magic(MAGIC_MIME_TYPE)

let ipfs_base_Uri = process.env.IPFS_HOST || 'http://localhost:18081'

/**
 *  Minio S3
 */

import { Client } from 'minio'
import sharp from 'sharp'
import temp from 'temp'
import path from 'path'
temp.track()
var minioClient = new Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
})
let bucket_name = 'speak3cdn'

/**
 *
 */

@Controller('/')
export class CdnMiddlewareController {
  /**
   * Deprecated: for reference only and should not be used for anything except images and small files.
   * Use go-ipfs directly with/without nginx reverse proxy
   * @param ipfsCid
   * @param res
   * @param queryParams
   * @returns
   */

  @Get('ipfs/:ipfsCid')
  async ipfsPath(
    @Param('ipfsCid') ipfsCid: string,
    @Response({ passthrough: true }) res,
    @Query() queryParams,
  ) {
    const data = await toBuffer(coreContainer.self.ipfs.cat(ipfsCid))
    const dat = filetype(data)

    // res.set({
    //     'Content-Type': data.mime,
    //     'Content-Length': data.length,
    //     'Content-Disposition': '',
    // });
    //await resize.writeAsync('./test.png')
    //const disContent = createReadStream('test.png')
    const streamFile = new StreamableFile(Buffer.from(data))
    ;(streamFile as any).getHeaders = (key) => {}
    //const file = createReadStream('./test2.jpg');
    //file.pipe(res);
    return streamFile
    //return streamFile;
  }

  @Get(`/thumb/:post_id/`)
  async thumbnailProxy(
    @Param('post_id') post_id: string,
    @Response({ passthrough: true }) res,
    @Query() queryParams,
  ) {
    //?format=png&mode=fit&width=3000&height=3000
    console.log(post_id)

    //console.log(data)
    //coreContainer.self.ipfs.cat(post_id).pipe(res)
    if (queryParams?.res) {
      await coreContainer.self.imageResized.findOne({})
      const data = await toBuffer(coreContainer.self.ipfs.cat(post_id))

      const [width, height] = queryParams.res.split('x')

      console.log(queryParams.res.split('x'))

      const image = await Jimp.read(Buffer.from(data))

      console.log(queryParams.res)
      console.log(Number(width), Number(height))

      const resize = await image.scaleToFit(Number(width), Number(height))
      console.log('running resize')
      const imageData = await resize.getBufferAsync('image/png')
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': imageData.length,
        'Content-Disposition': '',
      })

      const streamFile = new StreamableFile(Buffer.from(imageData))
      ;(streamFile as any).getHeaders = (key) => {}

      const buf = await Sharp(data).resize(Number(width), Number(height)).png().toBuffer()
      const dataResult2 = await coreContainer.self.ipfs.add(buf)
      console.log(dataResult2.cid.toString())

      const dataResult = await coreContainer.self.ipfs.add(imageData)
      console.log(dataResult.cid.toString())
      return streamFile
    }
    //const buf =  await resize.getBufferAsync('image/png');
    //console.log(resize)
    //console.log(buf)
    const data = await fs.readFile('./test2.jpg')
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': data.length,
      'Content-Disposition': '',
    })
    //await resize.writeAsync('./test.png')
    //const disContent = createReadStream('test.png')
    const streamFile = new StreamableFile(Buffer.from(data))
    ;(streamFile as any).getHeaders = (key) => {}
    //const file = createReadStream('./test2.jpg');
    //file.pipe(res);
    return streamFile
    //return streamFile;
  }

  @Get('/user/:user_id/avatar.png')
  async userAvatar() {}

  @Get('/user/:user_id/cover.png')
  async userCover() {}

  /**
   * Resizer
   *  
   * Aims to do the following

   * A get api
   * Passing in custom resolution
   * Fetch image from ipfs
   * Resize it
   * Upload resized image to IPFS
   * Give back CID of new resized image on ipfs
   */

  @Get('/image/resizer/:ipfsId')
  async resizer(
    @Param('ipfsId') ipfsId: string,
    @Response({ passthrough: true }) res,
    @Query() queryParams,
  ) {
    if (!(queryParams?.width && queryParams?.height && queryParams?.format)) {
      // if custom resolution is not provided
      return `Please send resolution as query params i.e 
        ${ipfs_base_Uri}/image/resizer/QmWiAWBd3QKwHBYnMdJJsEfNcAfrVYyscBXfQKYJU3VdYW?width=400&height=200&format=png`
    }

    // Fetching custom resolution
    const width = queryParams.width
    const height = queryParams.height
    const custom_format = queryParams.format

    console.log('Custom resolution : ' + width + 'x' + height)
    console.log('custom format is ', custom_format)

    // Fetching image contents from IPFS

    const ipfs_raw_data = coreContainer.self.ipfs.cat(ipfsId)

    // Converting ipfs raw data to an imae representation

    const imageBuffer = await toBuffer(ipfs_raw_data)
    const image = await Jimp.read(Buffer.from(imageBuffer))

    // Resizing image
    const resize = await image.scaleToFit(Number(width), Number(height))
    console.log('running resize')

    // change it to different containers

    const imageData = await resize.getBufferAsync(
      custom_format ? 'image/' + custom_format : 'image/png',
    )

    let tempFileName = ipfsId + '.' + custom_format

    temp.mkdir('temp', async function (err, dirPath) {
      var inputPath = path.join(dirPath, tempFileName)

      fs.writeFile(inputPath, imageData).then(async (res) => {
        console.log('file write res ', res)

        await uploadFile(inputPath, tempFileName)

        console.log('uploaded !')
      })

      // await fs.rm(tempFileName)
    })

    return imageData
  }

  // container format change
  // tmp library
  // save to s3/minio
  // return actual video

  @Get('/video/resizer/:ipfsId')
  async video_resizer(
    @Param('ipfsId') ipfsId: string,
    @Response({ passthrough: true }) res,
    @Query() queryParams,
  ) {
    if (!(queryParams?.width && queryParams?.height && queryParams?.format)) {
      // if custom resolution is not provided
      return `Please send resolution as query params i.e 
        ${ipfs_base_Uri}/video/resizer/QmWiAWBd3QKwHBYnMdJJsEfNcAfrVYyscBXfQKYJU3VdYW?width=400&height=200&format=mp4`
    }

    // Fetching custom resolution
    const width = queryParams.width
    const height = queryParams.height
    const custom_format = queryParams.format
    const ipfs_raw_data = coreContainer.self.ipfs.cat(ipfsId)
    let videoPath = ipfsId + custom_format
    const videoBuffer = await toBuffer(ipfs_raw_data)
    let outFile = 'output.webm'
    // fs.writeFile(videoPath, videoBuffer)

    // await transcodeVideo(videoPath, outFile, async () => {
    //   const updatedVideoBuffer = await fs.readFile(outFile)

    //   const dataResult = await coreContainer.self.ipfs.add(updatedVideoBuffer)
    //   console.log('new cid is ', dataResult.cid.toString())
    //   await fs.rm(videoPath)
    //   await fs.rm(outFile)

    //   console.log('intermediate files are deleted ')

    //   return dataResult.cid.toString()
    // })

    let tempFileName = ipfsId + '.' + custom_format

    temp.mkdir('temp', async function (err, dirPath) {
      var inputPath = path.join(dirPath, tempFileName)

      fs.writeFile(inputPath, videoBuffer).then(async (res) => {
        temp.mkdir('temp2', async function (err, dirPath) {
          var outputPath = path.join(dirPath, tempFileName)
          await transcodeVideo(
            inputPath,
            outputPath,
            async () => {
              // const updatedVideoBuffer = await fs.readFile(inputPath)

              // const dataResult = await coreContainer.self.ipfs.add(updatedVideoBuffer)

              await uploadFile(outputPath, tempFileName)

              return 'uploaded !'
            },
            { width, height },
          )
        })
      })

      // await fs.rm(tempFileName)

      // console.log('ipfs data is ', ipfs_raw_data)
    })
  }
}

async function transcodeVideo(inputPath, outputPath, callback, customResolution) {
  try {
    // return

    let video = ffmpeg(inputPath)
      .on('start', function (commandLine) {
        console.log('Spawned Ffmpeg with command: ' + commandLine)
      })
      .on('end', function (commandLine) {
        console.log('processed !')
        if (callback) {
          callback()
        }
      })

      .on('error', function (err, stdout, stderr) {
        console.log('Cannot process video: ' + err.message)
      })
      // .size('640x400')
      .outputFormat('webm')
      // .outputFPS(5)
      // .noAudio()
      .output(outputPath)

    if (customResolution) {
      video.size(customResolution.width + 'x' + customResolution.height)
    }

    video.run()
  } catch (error) {
    console.error('Error during transcoding:', error.message)
  }
}

// async function makeBucket() {
//   await minioClient.makeBucket(bucket_name, (res) => {
//     console.log(res)
//   })
// }

/** Return mimetype of data. */
export function mimeMagic(data: Buffer) {
  return new Promise<string>((resolve, reject) => {
    magic.detect(data, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}
async function uploadFile(filepath, filename, customResolution = null) {
  console.log('file name is ', filename)

  // const mimeType = mime.lookup(filename)
  const imageBuffer = await fs.readFile(filepath)
  let mimeType = await mimeMagic(imageBuffer)
  var metaData = {
    'Content-Type': mimeType,
    // 'X-Amz-Meta-Testing': 1234,
    // example: 5678,
  }

  // If it's an image, resize it before uploading
  if (mimeType.startsWith('image')) {
    let resizedBuffer = imageBuffer

    if (customResolution) {
      resizedBuffer = await sharp(imageBuffer)
        .resize(customResolution.width, customResolution.height, {
          fit: sharp.fit.inside,
        })
        .toBuffer()
    }

    minioClient.putObject(bucket_name, filename, resizedBuffer, function (err, etag, res) {
      console.log(err, etag, res)

      if (err) return console.log(err)
      console.log('Image uploaded successfully.')
    })
  } else {
    // For other file types, upload as is
    minioClient.fPutObject(bucket_name, filename, filepath, metaData, function (err, etag) {
      console.log(err, etag)
      if (err) return console.log(err)

      console.log('File uploaded successfully.')
    })
  }
}
