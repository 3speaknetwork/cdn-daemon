// hub.service.ts

import { insertOrchestralNode } from '../api/Middlewares/orchesterNodeMiddleware'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HubService {
  async registerNode(nodeData: any): Promise<any> {
    await insertOrchestralNode(nodeData)
  }
}
