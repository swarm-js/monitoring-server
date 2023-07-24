import {
  Access,
  Description,
  FastifyReply,
  Post,
  Prefix,
  Returns,
  Title
} from '@swarmjs/core'
import crypto from 'crypto'
import heicConvert from 'heic-convert'
import AWS from 'aws-sdk'
import { BadRequest } from 'http-errors'

@Title('Uploads')
@Description('Handles file uploads')
@Prefix('/upload')
export default class Upload {
  @Title('Upload a new file')
  @Description('Uploads a file and returns its URL')
  @Post('/')
  @Access('swarm:loggedIn')
  @Returns(201, 'UploadedFile', 'The uploaded file URL')
  @Returns(400, 'Error', 'The uploaded file is not allowed')
  @Returns(403, 'Error', 'You cannot upload files')
  static async uploadFile (request: any, reply: FastifyReply) {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/png',
      'image/heic',
      'application/pdf',
      'audio/mp3',
      'video/webm',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    let file = await request.file()
    file.data = await file.toBuffer()

    if (request.query.name !== undefined) file.filename = request.query.name

    if (file.mimetype === 'image/heic') {
      file.data = await heicConvert({
        buffer: file.data,
        format: 'JPEG',
        quality: 0.8
      })
      file.filename += '.jpg'
      file.mimetype = 'image/jpg'
    }

    if (allowedMimes.includes(file.mimetype) === false) {
      throw new BadRequest()
    }

    if (file.size > +(process.env.FILE_UPLOAD_LIMIT ?? 5242880)) {
      throw new BadRequest()
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.S3_API_KEY,
      secretAccessKey: process.env.S3_API_SECRET,
      region: process.env.S3_REGION,
      s3BucketEndpoint: true,
      endpoint: process.env.S3_ENDPOINT
    })

    const hash = crypto
      .createHash('sha1')
      .update(file.data, 'binary')
      .digest('hex')

    const url = await new Promise((resolve: any, reject: any) => {
      s3.upload(
        {
          Bucket: process.env.S3_BUCKET ?? '',
          Key: `${hash}-${file.filename}`,
          Body: file.data,
          ACL: 'public-read'
        },
        async (err: any, data: any) => {
          if (err) reject(err)
          else resolve(data.Location)
        }
      )
    })
    reply.code(201)
    return {
      url
    }
  }
}
