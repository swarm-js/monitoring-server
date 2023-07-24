import {
  MongooseAuthPlugin,
  InvitationMethods,
  AuthFields
} from '@swarmjs/auth'
import { SmtpPlugin } from '@swarmjs/smtp'
import mongoose from 'mongoose'
import config from '../config/authConfig'
import { geocode } from '../tools/geocode'
require('dotenv').config()

interface IUserAddress {
  line1: string
  line2: string
  zipcode: string
  city: string
  state: string
  country: string
}

interface IUserLocation {
  type: string
  coordinates: number[]
}

interface IUser extends AuthFields {
  firstname: string
  lastname: string
  email: string
  phone: string
  avatar: string
  address: IUserAddress
  location: IUserLocation
}

interface UserModel extends mongoose.Model<IUser, {}, {}>, InvitationMethods {}

// 2. Create a Schema corresponding to the document interface.
const schema = new mongoose.Schema<IUser, UserModel, {}>(
  {
    firstname: { $type: String, default: '' },
    lastname: { $type: String, default: '' },
    email: { $type: String, default: '' },
    phone: { $type: String, default: '' },
    avatar: {
      $type: String,
      default:
        'data:image/png;base64,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'
    },
    address: {
      line1: { $type: String, default: '' },
      line2: { $type: String, default: '' },
      zipcode: { $type: String, default: '' },
      city: { $type: String, default: '' },
      state: { $type: String, default: '' },
      country: { $type: String, default: 'FR' }
    },
    location: {
      type: {
        $type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: {
        $type: [Number],
        required: true,
        default: [0, 0]
      }
    }
  },
  { typeKey: '$type' }
)

schema.pre('save', async function (next) {
  if (this.isModified('address')) {
    this.location = {
      type: 'Point',
      coordinates: await geocode({
        street: this.address?.line1,
        postalcode: this.address?.zipcode,
        city: this.address?.city,
        country: this.address?.country,
        state: this.address?.state
      })
    }
  }

  this.lastname = (this.lastname ?? '').toUpperCase()

  return next()
})

schema.index({ location: '2dsphere' })

schema.plugin(MongooseAuthPlugin, { ...config })

schema.plugin(SmtpPlugin, {
  host: process.env.SMTP_HOST,
  port: +(process.env.SMTP_PORT ?? 465),
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  fromEmail: process.env.FROM_EMAIL,
  fromName: process.env.FROM_NAME
})

// 3. Create a Model.
export default mongoose.model<IUser, UserModel>('User', schema)
