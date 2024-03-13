export function isIPFSUrl(decodedUrl: string): { isIPFS: boolean; cid?: string } {
  try {
    // Regular expression for traditional IPFS URLs (ipfs://)
    const ipfsProtocolRegex = /^ipfs:\/\/([a-zA-Z0-9]*)$/

    const ipfsMatch = decodedUrl.match(ipfsProtocolRegex)
    if (ipfsMatch) {
      const cid = ipfsMatch[1]
      return { isIPFS: true, cid }
    }

    // Regular expression for IPFS gateway URLs
    const ipfsGatewayRegex =
      /^(https?:\/\/(?:.*\.)?(ipfs\.io|cloudflare-ipfs\.com|ipfs\.dweb\.link)\/ipfs\/([a-zA-Z0-9]*))$/

    const gatewayMatch = decodedUrl.match(ipfsGatewayRegex)
    if (gatewayMatch) {
      const cid = gatewayMatch[3]
      return { isIPFS: true, cid }
    }

    // Regular expression for other IPFS URLs with CID
    const otherIpfsUrlRegex =
      /^(https?:\/\/(?:.*\.)?(?:ipfs-[a-zA-Z0-9-]+\.b-cdn\.net)\/ipfs\/([a-zA-Z0-9]*))$/

    const otherIpfsMatch = decodedUrl.match(otherIpfsUrlRegex)
    if (otherIpfsMatch) {
      const cid = otherIpfsMatch[2]
      return { isIPFS: true, cid }
    }
  } catch (error) {
    // Handle potential errors during URL parsing
    console.error('Error parsing URL:', error)
  }

  return { isIPFS: false }
}

// Example usage:
// const url1 = 'ipfs://bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4'
// const url2 =
//   'https://cloudflare-ipfs.com/ipfs/bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4'
// const url3 =
//   'https://ipfs-3speak.b-cdn.net/ipfs/Qmf1XukAoMdatAW9HPDZL6Gphrgzvew5Km3rzvHf194DmM/480p/480p_0.ts'

// const result1 = isIPFSUrl(url1)
// const result2 = isIPFSUrl(url2)
// const result3 = isIPFSUrl(url3)

// console.log('URL 1:', result1)
// console.log('URL 2:', result2)
// console.log('URL 3:', result3)
