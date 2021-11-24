/** 
 * THIS FILE SHOULD BE ONLY EXECUTED FROM DOCKER OR IN DEV ENVIRONMENT
*/


import {Ed25519Provider} from 'key-did-provider-ed25519'
import Crypto from 'crypto'
import { DID } from 'dids'
import KeyResolver from 'key-did-resolver'
import Axios from 'axios'
import fs from 'fs'

void (async () => {
    console.log('starting gme setup')
    const key = new Ed25519Provider(Crypto.randomBytes(32))
    const did = new DID({ provider: key, resolver: KeyResolver.getResolver() })
    
    await did.authenticate(); 

    let initialRecords = {}
    try {
        const {data:ipInfo}: any = await Axios.get('https://api.ipify.org/?format=json')
        if(ipInfo.ip) {
            initialRecords['A'] = ipInfo.ip
        }
    } catch {
        console.error('Error: server does not have a detectable IPv4 address!')
        process.exit(-1)
    }
    
    try {
        const {data:ipInfo6}: any = await Axios.get('https://api6.ipify.org/?format=json')
        if(ipInfo6.ip) {
            initialRecords['AAAA'] = ipInfo6.ip
        }
    } catch {
        console.warn('Warning: server does not have a detectable IPv6 address!')
    }



    const postOptions = {
        jws: await did.createJWS({
            action: 'register',
            roles: [
                'cdn'
            ],
            initialRecords
        })
    }
    console.log(initialRecords)
    
    try {
        const {data}:{data: any} = await Axios.post('https://reg.spk.domains/spk-domains/api/v0/register', postOptions)
        console.log(data)
        if(!data.name) {
            process.exit(-1)
        }
        console.log(`registering ${data.name}`)
        let nginxConf = fs.readFileSync('./data/nginx/app.conf').toString()
        for(let x = 0; x < 6; x++) {
            nginxConf = nginxConf.replace('FILL_DOMAIN', data.name)
        }
        //console.log(nginxConf)
        //fs.writeFileSync('./data/nginx/app.conf', nginxConf)
        let letsEncryptInit = fs.readFileSync('./init-letsencrypt.sh').toString()
        letsEncryptInit = letsEncryptInit.replace('FILL_DOMAIN', data.name)
        //fs.writeFileSync('./init-letsencrypt.sh', letsEncryptInit)
    } catch (ex) {
        console.log(ex.message)
        process.exit(-1)
    }

})();