# minio Installation Steps To run localy;

- Install Minio
- Run Min-io server locally
  minio server C:\minio --console-address :9001

- setup server credientials on local machine where password and username are `minioadmin`

mc.exe alias set local http://127.0.0.1:9000 minioadmin minioadmin

### Task :

Image resizing
-- Customizable resolution
-- Store cached images to Minio S3
-- Return as jpeg, png, and webp
-- No cache options & cache control

Video transcoding
-- Use ffmpeg to remux different video formats. Such as mkv -> mp4, etc
-- Transcode status should be stored in database
-- API should return transcode status and once complete start serving the transcoded video
-- Transcoded video should be cached in S3
-- The transcoding should not change resolution or do any highly intensive video encode/deocde options if possible.

Documentation
-- Swagger API documentation built in to the project. Use that to document how all of these APIs

Whitepaper: https://peakd.com/hive/@spknetwork/spk-network-light-paper
https://min.io/

minio:
image: minio/minio:RELEASE.2019-08-14T20-37-41Z
networks: - acela-core
ports: - "127.0.0.1:9000:9000"
volumes: - "./data/s3-uploads:/data/"
environment:
MINIO_ACCESS_KEY: AKIAIOSFODNN7EXAMPLE
MINIO_SECRET_KEY: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
