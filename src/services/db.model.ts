

export interface TrackedFile {
    ipfsHash: string

    last_pinged: Date //Last time file accessed
    last_updated: Date //Last time the file has been checked
    first_seen: Date //First time the file was added to the index OR manually pinned
    expiration: Date | null
}

export interface DhtRecord {
    ipfsHash: string
    peer_id: string

    last_pinged: Date
    last_updated: Date
    first_seen: Date
}

export interface PeerInfo {
    peer_id: string
    peer_info: Object

    last_seen: Date
    first_seen: Date
    
    nickname?: string
}

export interface ImageSized {
    originHash: string;
    height: number;
    width: number;
    ipfsHash: string
    size: number;

    created_at: Date;
    last_accessed: Date;
}

interface QueryDelegates {

}