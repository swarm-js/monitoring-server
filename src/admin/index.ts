import { AdminPluginOptions } from '@swarmjs/admin'

require('dotenv').config()

export default {
  userAccessKey: 'admin',
  logo: (process.env.LOGO ?? '').length ? process.env.LOGO : null,
  themeColor: process.env.COLOR ?? '#2196F3',
  logoBackgroundColor: process.env.LOGO_BG ?? 'transparent',
  title: process.env.APP_TITLE ?? '',
  defaultCountry: process.env.DEFAULT_COUNTRY ?? 'US',
  tabs: [require('./tabs/users')]
} as AdminPluginOptions
