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

      console.log('headers are ', req.headers)

      let ip = extractIPv4Address(req.headers.host)

      // }
      try {
        let response = await axios.get(`https://ipinfo.io/json`)
        console.log(response.data)
        ip = response.data.hostname
      } catch (e) {
        return 'Error in fetching ip information'
      }

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
function extractIPv4Address(str: string): string | null {
  // Regular expression matching an IPv4 address format
  const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/

  // Split the string based on ":" to separate address and port
  const parts = str.split(':')

  // Check if there's an address part and if it matches the IPv4 format
  if (parts.length > 0 && ipRegex.test(parts[0])) {
    return parts[0]
  } else {
    return null
  }
}
