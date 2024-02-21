import { Controller, Post, Body, Req, Ip } from '@nestjs/common'
import { HubService } from '../../services/hub.service'
import axios from 'axios'

@Controller('hub')
export class HubController {
  constructor(private readonly hubService: HubService) {}

  @Post('register')
  async registerNode(
    @Body('endpoint') endpoint: string,
    @Body('address') address: string,
    @Body('did') did: string,
    @Body('stats')
    stats: {
      throughput: number
      upspeed: number
      downspeed: number
    },
    @Req() req: any,
    // @Ip() ip: any,
  ): Promise<any> {
    try {
      if (!(endpoint && address && did && stats)) {
        return 'Fields are missing . Make sure you include "endpoint , address , did , stats in your request body" '
      }
      // let ip = req.headers.host
      let ip

      // if (ip != '::1') {
      try {
        const response = await axios.get(`https://ipinfo.io/json`)
        console.log('response from ipinfo is  ', response.data)
        ip = response.data['ip']
        console.log('ip is ', ip)
      } catch (e) {
        console.log('error is ', e)
        return 'error in fetching IP address information !'
      }
      // }

      console.log('Registering Orchester Instance')

      // Assuming you have a HubService with a method registerNode
      const result = await this.hubService.registerNode({
        endpoint,
        address,
        did,
        stats,
        ipAddress: ip,
      })

      return { success: true, result }
    } catch (error) {
      console.error('Error registering node:', error)
      return { success: false, error: 'Failed to register node.' }
    }
  }
}
