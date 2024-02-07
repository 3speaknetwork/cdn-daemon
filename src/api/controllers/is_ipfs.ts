export function isIPFSUrl(decodedUrl: string): { isIPFS: boolean; cid?: string } {
  try {
    // Attempt to parse the string as a URL
    const url = new URL(decodedUrl)

    // Check for traditional IPFS URLs (ipfs://)
    if (url.protocol === 'ipfs:') {
      const cid = url.hostname
      return { isIPFS: true, cid }
    }

    // Check for IPFS gateway URLs using common patterns
    const gatewayKeywords = ['ipfs.io', 'cloudflare-ipfs.com', 'ipfs.dweb.link']
    const pathSegments = url.pathname.split('/')
    if (
      gatewayKeywords.some((keyword) => url.hostname.includes(keyword)) &&
      pathSegments.some((segment) => segment === 'ipfs')
    ) {
      const cidIndex = pathSegments.findIndex((segment) => segment === 'ipfs') + 1
      if (cidIndex < pathSegments.length) {
        const cid = pathSegments[cidIndex]
        return { isIPFS: true, cid }
      }
    }
  } catch (error) {
    // Handle potential errors during URL parsing
    console.error('Error parsing URL:', error)
  }

  return { isIPFS: false }
}

// Example usage:
const url1 = 'ipfs://bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4'
const url2 =
  'https://cloudflare-ipfs.com/ipfs/bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4'
const url3 = 'https://notapfsserver.com/somefile'

const result1 = isIPFSUrl(url1)
const result2 = isIPFSUrl(url2)
const result3 = isIPFSUrl(url3)

console.log('URL 1:', result1)
console.log('URL 2:', result2)
console.log('URL 3:', result3)
