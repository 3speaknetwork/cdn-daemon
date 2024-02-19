import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Header,
  StreamableFile,
  Res,
  Query,
  Req,
  Ip,
} from '@nestjs/common'
import type { Response } from 'express'
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
import util from 'util'

const ffmpegPromise = util.promisify(ffmpeg)

const magic = new Magic(MAGIC_MIME_TYPE)

let ipfs_base_Uri = process.env.IPFS_HOST || 'http://localhost:18081'
let supportedImageFormats = ['bmp', 'jpeg', 'gif', 'tiff', 'png']
let supportedVideoFormats = ['mp4', 'webm', 'mkv']
/**
 *  Minio S3
 */

import { Client } from 'minio'
import sharp from 'sharp'
import temp from 'temp'
import path from 'path'
import { isIPFSUrl } from './is_ipfs'
import axios from 'axios'
import { isHLSFile } from './is_hls'
import { statsLoggerMiddleware } from '../Middlewares/statsLoggerMiddleware'

// temp.track()
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
    @Res({ passthrough: true }) res,
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
    @Res({ passthrough: true }) res,
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

  @Get('/image/resizer/:base64EncodedUrl')
  async resizer(
    @Param('base64EncodedUrl') base64EncodedUrl: string,
    @Res({ passthrough: true }) res: Response,
    @Query() queryParams,
    @Req() req: any,
  ) {
    console.log('request is ', req)

    let ip = req.headers.host
    console.log('ip is ', ip)

    let headers = await JSON.stringify(req.headers)
    let startTime = new Date().getTime() / 1000
    let fetchedDataSize = 0
    let uploadDataSize = 0

    if (!queryParams?.format) {
      // if custom resolution is not provided
      return `Please send resolution as query params i.e 
        ${ipfs_base_Uri}/image/resizer/base64-encoded-url?format=png&cacheControl=no-cache`
    }
    if (!supportedImageFormats.includes(queryParams.format)) {
      return 'Un-supported Format , supported formats are ' + supportedImageFormats.toString()
    }

    const decodedUrl: string = Buffer.from(base64EncodedUrl, 'base64').toString('utf-8')
    console.log('Decoded:', decodedUrl)

    // Fetching custom resolution
    // const width = queryParams.width
    // const height = queryParams.height

    const custom_format = queryParams.format
    const cacheControl = queryParams.cacheControl

    // cache control if ipfs or not
    // custom return type
    // base64url

    // console.log('Custom resolution : ' + width + 'x' + height)
    console.log('custom format is ', custom_format)

    // Fetching image contents from IPFS
    let result: any = isIPFSUrl(decodedUrl)
    let raw_data: any
    let imageBuffer
    if (result.isIPFS) {
      console.log('ipfs content')

      raw_data = coreContainer.self.ipfs.cat(result.cid)

      imageBuffer = await toBuffer(raw_data)
      fetchedDataSize = imageBuffer.length
    } else {
      console.log('non ipfs content')

      raw_data = await axios.get(decodedUrl)
      raw_data = raw_data.data

      const response = await axios.get(decodedUrl, {
        responseType: 'arraybuffer',
      })
      // console.log('response is ', response)
      fetchedDataSize = response.data.length

      console.log(`Data Buffer Size: ${fetchedDataSize} bytes`)

      raw_data = response.data

      // Convert the array buffer to a Buffer
      imageBuffer = Buffer.from(raw_data, 'binary')
    }

    // Converting ipfs raw data to an imae representation

    const image = await Jimp.read(Buffer.from(imageBuffer))

    console.log('converted to image ')

    // Resizing image
    // const resize = await image.scaleToFit(Number(width), Number(height))

    // change it to different containers

    const imageData = await image.getBufferAsync(
      custom_format ? 'image/' + custom_format : 'image/png',
    )

    let tempFileName = base64EncodedUrl + '.' + custom_format
    console.log('filename is ', tempFileName)

    // Cache Check
    let shouldNotCache = !result.isIPFS && cacheControl == 'no-cache'
    console.log('should not cache ', shouldNotCache)

    if (shouldNotCache) {
      console.log('cache control disabled !')
    } else {
      // cache on S3 - Minio Bucket]
      console.log('caching now')

      temp.mkdir('temp', async function (err, dirPath) {
        var inputPath = path.join(dirPath, tempFileName)

        fs.writeFile(inputPath, imageData).then(async (res) => {
          console.log('file write res ', res)

          uploadDataSize = await uploadFile(inputPath, tempFileName)
          let endTime = new Date().getTime() / 1000

          let _req = {
            url: decodedUrl,
            ip,
            fetchedDataSize,
            uploadDataSize,
            headers,
            cacheControl,
            timeTaken: parseInt('' + (endTime - startTime)),
            status: 200,
          }

          // console.log('_req object is ', _req)
          await statsLoggerMiddleware(_req)

          console.log('uploaded !')
        })
        // res.set()
        // await fs.rm(tempFileName)
      })
    }

    // console.log('res is ', res)

    res.set({
      'Content-Type': 'image/' + custom_format,
      'Content-Disposition': '',
    })

    // await statsLoggerMiddleware()

    return new StreamableFile(imageData)
  }

  // container format change
  // tmp library
  // save to s3/minio
  // return actual video

  @Get('/video/resizer/:base64EncodedUrl')
  async video_resizer(
    @Param('base64EncodedUrl') base64EncodedUrl: string,
    @Res({ passthrough: true }) res,
    @Query() queryParams,
    @Req() req: any,
  ) {
    try {
      console.log('request is ', req)

      let ip = req.headers.host
      console.log('ip is ', ip)

      let headers = await JSON.stringify(req.headers)
      let startTime = new Date().getTime() / 1000
      let fetchedDataSize = 0
      let uploadDataSize = 0
      if (!queryParams?.format) {
        // if custom resolution is not provided
        return `Please send resolution as query params i.e 
        ${ipfs_base_Uri}/video/resizer/QmWiAWBd3QKwHBYnMdJJsEfNcAfrVYyscBXfQKYJU3VdYW?format=mp4&cacheControl=no-cache`
      }

      const custom_format = queryParams.format
      const cacheControl = queryParams.cacheControl

      if (!supportedVideoFormats.includes(queryParams.format)) {
        return 'Un-supported Format , supported formats are ' + supportedVideoFormats.toString()
      }

      let decodedUrl: string = Buffer.from(base64EncodedUrl, 'base64').toString('utf-8')

      // if (decodedUrl.startsWith('ipfs://')) {
      //   decodedUrl = decodedUrl.slice(7)
      // }

      console.log('Decoded:', decodedUrl)

      let result: any = isIPFSUrl(decodedUrl)
      let raw_data: any
      let videoBuffer

      if (result.isIPFS) {
        console.log('getting data from IPFS')

        raw_data = await toBuffer(coreContainer.self.ipfs.cat(result.cid))
        videoBuffer = Buffer.from(raw_data)
        fetchedDataSize = videoBuffer.length
      } else {
        raw_data = await axios.get(decodedUrl, { responseType: 'arraybuffer' })
        fetchedDataSize = raw_data.data.length

        raw_data = raw_data.data

        // Convert the array buffer to a Buffer
        videoBuffer = Buffer.from(raw_data, 'binary')
      }
      console.log('fetched file data')

      let tempFileName = base64EncodedUrl + '.' + custom_format

      // cache control check
      let shouldNotCache = !result.isIPFS && cacheControl == 'no-cache'
      console.log('should not cache ', shouldNotCache)

      if (shouldNotCache) {
        console.log('cache control disabled !')
      } else {
        // cache on S3 - Minio Bucket
        console.log('uploading on s3 bucket ')

        const inputPath = await new Promise<string>((resolve) => {
          temp.mkdir('temp', (err, dirPath) => {
            let path_ = path.join(dirPath, tempFileName)
            fs.writeFile(path_, videoBuffer).then(() => {
              resolve(path_)
            })
          })
        })

        const outputPath = await new Promise<string>((resolve) => {
          temp.mkdir('temp2', (err, dirPath) => {
            resolve(path.join(dirPath, tempFileName))
          })
        })
        let is_hls_file = await isHLSFile(decodedUrl)
        console.log({ is_hls_file })

        const video_path = is_hls_file ? decodedUrl : inputPath
        console.log('path is ', video_path)

        await transcodeVideo(video_path, outputPath, custom_format)
        console.log('starting upload now')

        uploadDataSize = await uploadFile(outputPath, tempFileName)
        //  uploadDataSize = await uploadFile(inputPath, tempFileName)
        let endTime = new Date().getTime() / 1000

        let _req = {
          url: decodedUrl,
          ip,
          fetchedDataSize,
          uploadDataSize,
          headers,
          cacheControl,
          timeTaken: parseInt('' + (endTime - startTime)),
          status: 200,
        }

        // console.log('_req object is ', _req)
        await statsLoggerMiddleware(_req)
        console.log('uploaded !')
      }

      res.set({
        'Content-Type': 'video/' + custom_format,
        'Content-Disposition': '',
      })

      return new StreamableFile(videoBuffer)
    } catch (error) {
      console.error('Error during video resizing:', error.message)
      // Handle the error appropriately (send error response, log, etc.)
      return 'Error during video resizing'
    }
  }
}

async function transcodeVideo(inputPath, outputPath, custom_format) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .on('start', (commandLine) => {
        console.log('Spawned Ffmpeg with command: ' + commandLine)
      })
      .on('end', async () => {
        console.log('Processed!')
        await resolve()
      })
      .on('error', async (err, stdout, stderr) => {
        console.log('Cannot process video: ' + err.message)
        await reject(err)
      })
      .outputFormat(custom_format)
      .output(outputPath)
      .run()
  })
}

async function makeBucket() {
  await minioClient.makeBucket(bucket_name, (res) => {
    console.log(res)
  })
}

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

const readFileAsync: any = util.promisify(fs.readFile)

async function uploadFile(filepath: string, filename, customResolution = null) {
  try {
    // await makeBucket()
    console.log('Bucket created')
  } catch (error) {
    console.log('Bucket Already exists ', error)
  }
  try {
    let complete_file_name = filepath
    console.log('file name is ', complete_file_name)

    const fileBuffer: any = await fs.readFile(complete_file_name)
    console.log('file buffer is read')

    let mimeType = await mimeMagic(fileBuffer)

    var metaData = {
      'Content-Type': mimeType,
    }

    // If it's an image, resize it before uploading
    if (mimeType.startsWith('image')) {
      console.log('image detected ')

      let resizedBuffer = fileBuffer

      // if (customResolution) {
      //   resizedBuffer = await sharp(fileBuffer)
      //     .resize(customResolution.width, customResolution.height, {
      //       fit: sharp.fit.inside,
      //     })
      //     .toBuffer();
      // }

      const [err, etag, res] = await new Promise<[Error | null, string | object, any]>(
        (resolve) => {
          minioClient.putObject(bucket_name, filename, resizedBuffer, (err, etag, res) => {
            resolve([err, etag, res])
          })
        },
      )

      console.log(err, etag, res)

      if (err) {
        return console.log(err)
      }

      console.log('File uploaded successfully. ', resizedBuffer.length)
      return resizedBuffer.length
    } else {
      console.log('video detected')

      // For other file types, upload as is
      console.log('uploading now')

      const [err, etag] = await new Promise<[Error | null, string | object]>((resolve) => {
        minioClient.fPutObject(bucket_name, filename, filepath, metaData, (err, etag) => {
          resolve([err, etag])
        })
      })
      console.log('File uploaded successfully')

      console.log(err, etag)

      if (err) {
        return console.log(err)
      }

      console.log('File uploaded successfully.')
      return fileBuffer.length
    }
  } catch (error) {
    console.log('Error in uploading ', error)
  }
}
