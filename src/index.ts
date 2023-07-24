import { AuthPlugin } from '@swarmjs/auth'
import { Swarm } from '@swarmjs/core'
import { MonitorPlugin } from '@swarmjs/monitoring'
import { SwaggerPlugin } from '@swarmjs/swagger'
import { AdminPlugin } from '@swarmjs/admin'
import mongoose, { ConnectOptions } from 'mongoose'
import Users from './controllers/Users'
import config from './config/authConfig'
import User from './models/User'
import Upload from './controllers/Upload'
import path from 'path'
import adminConfig from './admin'

require('dotenv').config()

const app = new Swarm({
  logLevel: process.env.LOG_LEVEL ?? 'info',
  title: process.env.APP_TITLE,
  description: process.env.APP_DESCRIPTION,
  baseUrl: process.env.BASE_URL ?? '',
  servers: [
    {
      url: process.env.BASE_URL ?? '',
      description: process.env.APP_TITLE ?? ''
    }
  ],
  languages: ['fr', 'en'],
  http2: process.env.HTTP2 === 'true',
  sslKeyPath: path.join(__dirname, '..', process.env.HTTPS_KEY_FILE ?? ''),
  sslCertPath: path.join(__dirname, '..', process.env.HTTPS_CERT_FILE ?? '')
})

app.fastify.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

app.fastify.register(require('@fastify/multipart'), {
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: +(process.env.FILE_UPLOAD_LIMIT ?? 5242880), // Max field value size in bytes
    fields: 10, // Max number of non-file fields
    fileSize: +(process.env.FILE_UPLOAD_LIMIT ?? 5242880), // For multipart forms, the max file size in bytes
    files: 1, // Max number of file fields
    headerPairs: 2000 // Max number of header key=>value pairs
  }
})

app.use(MonitorPlugin)
app.use(SwaggerPlugin)
app.use(AuthPlugin, { ...config, model: User })
app.use(AdminPlugin, adminConfig)

app.controllers.add(Users)
app.controllers.add(Upload)

async function main () {
  mongoose.connect(process.env.MONGO_DSN ?? 'mongodb://localhost:27017/test', {
    useNewUrlParser: true
  } as ConnectOptions)
  await app.listen(+(process.env.PORT ?? 8080), process.env.HOST ?? '0.0.0.0')
}
main()
