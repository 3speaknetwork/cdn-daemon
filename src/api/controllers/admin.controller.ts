import { Controller, Get, InternalServerErrorException, Param } from '@nestjs/common'
import { coreContainer } from '../api.module'

@Controller('/admin/api/v0')
export class AdminController {

    @Get('addFile/:id')
    async ipfsPath(@Param('id') streamId: string) {
        await coreContainer.self.trackerService.addPin(streamId)
    }

    @Get(`/trackedfiles`) 
    async trackedFiles() {

        const data = await coreContainer.self.trackedFiles.find({}).toArray()
        return data;
    }
}