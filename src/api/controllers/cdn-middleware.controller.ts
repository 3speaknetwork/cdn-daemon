import { Controller, Get, InternalServerErrorException, Param, Header, Response, StreamableFile, Res, Query  } from '@nestjs/common'
import Jimp from 'jimp/es';
import fs, {createReadStream } from 'fs'

import { coreContainer } from '../api.module'
import toBuffer from 'it-to-buffer'

import Sharp from 'sharp'

@Controller('/')
export class CdnMiddlewareController {

    @Get('ipfs/:ipfsCid')
    async ipfsPath() {

    }

    @Get(`/thumb/:post_id/`) 
    async thumbnailProxy(@Param('post_id') post_id: string, @Response({passthrough: true}) res, @Query() queryParams){
        //?format=png&mode=fit&width=3000&height=3000
        console.log(post_id)


        //console.log(data)
        //coreContainer.self.ipfs.cat(post_id).pipe(res)
        if(queryParams?.res) {
            await coreContainer.self.imageResized.findOne({
                
            })
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
            });
            const streamFile = new StreamableFile(Buffer.from(imageData));
            (streamFile as any).getHeaders = (key) => {}

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
        const data = fs.readFileSync('./test2.jpg')
        res.set({
            'Content-Type': 'image/png',
            'Content-Length': data.length,
            'Content-Disposition': '',
        });
        //await resize.writeAsync('./test.png')
        //const disContent = createReadStream('test.png')
        const streamFile = new StreamableFile(Buffer.from(data));
        (streamFile as any).getHeaders = (key) => {}
        //const file = createReadStream('./test2.jpg');
        //file.pipe(res);
        return streamFile
        //return streamFile;
    }

    @Get('/user/:user_id/avatar.png')
    async userAvatar() {

    }

    @Get('/user/:user_id/cover.png')
    async userCover() {

    }
}