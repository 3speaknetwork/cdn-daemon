import { CoreService } from "./core.service";


export class BindingService {
    self: CoreService
    
    constructor(self) {
        this.self = self;
    }

    async start() {


        setInterval(async() => {
            const bitswapStat = await this.self.ipfs.bitswap.stat()
            for(let item of bitswapStat.wantlist) {
                this.self.trackerService.queryConnect(item.toString())
            }
        }, 1000)
    }
}