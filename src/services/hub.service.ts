// hub.service.ts

import { OrchesterNode, insertOrchestralNode } from '../api/Middlewares/orchesterNodeMiddleware'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HubService {
  async registerNode(nodeData: OrchesterNode): Promise<void> {
    await insertOrchestralNode(nodeData)
  }
}
