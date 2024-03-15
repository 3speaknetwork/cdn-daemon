import { Controller, Post, Body, Req, Ip, Request } from '@nestjs/common'
import { HubService } from '../../services/hub.service'
import { WithAuthData } from '../Middlewares/auth.interface'
import { RegisterRequestBody, registerRequestBodySchema } from './hub.interface'

@Controller('hub')
export class HubController {
  constructor(private readonly hubService: HubService) { }

  @Post('register')
  async registerNode(
    @Body() uncheckedBody: WithAuthData,
  ): Promise<any> {
    try {
      const { endpoint, ipAddress, did, stats } = registerRequestBodySchema.parse(uncheckedBody) as RegisterRequestBody

      console.log('Registering Orchester Instance')

      // Assuming you have a HubService with a method registerNode
      const result = await this.hubService.registerNode({
        endpoint,
        did,
        stats,
        ipAddress,
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
