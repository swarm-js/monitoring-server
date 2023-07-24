import { AuthPluginOptions } from '@swarmjs/auth'

require('dotenv').config()

export default {
  jwtKey: process.env.AUTH_JWT_KEY,
  rpName: process.env.APP_TITLE ?? '',
  logo: (process.env.LOGO ?? '').length ? process.env.LOGO : null,
  logoBackgroundColor: process.env.LOGO_BG ?? 'transparent',
  themeColor: process.env.COLOR ?? '#2196F3',
  validationRequired: process.env.AUTH_VALIDATION_REQUIRED === 'true',
  googleClientId: process.env.AUTH_GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET ?? '',
  facebookClientId: process.env.AUTH_FACEBOOK_CLIENT_ID ?? '',
  facebookClientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET ?? '',
  allowedDomains: (process.env.AUTH_DOMAINS ?? '')
    .split(',')
    .filter(a => a.length),
  password: process.env.AUTH_PASSWORD === 'true',
  fido2: process.env.AUTH_FIDO2 === 'true',
  facebook: process.env.AUTH_FACEBOOK === 'true',
  google: process.env.AUTH_GOOGLE === 'true',
  googleAuthenticator: process.env.AUTH_GOOGLE_AUTHENTICATOR === 'true',
  ethereum: process.env.AUTH_ETHEREUM === 'true',
  invite: process.env.AUTH_INVITE === 'true',
  register: process.env.AUTH_REGISTER === 'true',
  sessionDuration: +(process.env.AUTH_SESSION_DURATION ?? 3600)
} as AuthPluginOptions
