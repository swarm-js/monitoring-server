import { createCrud } from '@swarmjs/admin'
import countries from 'i18n-iso-countries'
import User from '../../models/User'

export default createCrud(
  'users',
  User,
  {
    name: 'Users',
    description: 'Manage users',
    icon: 'users'
  },
  {
    create: true,
    edit: true,
    delete: true,
    fields: {
      avatar: {
        label: 'Avatar',
        type: 'image'
      },
      firstname: {
        label: 'Prénom',
        type: 'text',
        required: true
      },
      lastname: {
        label: 'Nom',
        type: 'text',
        required: true
      },
      email: {
        label: 'Adresse email',
        type: 'email',
        required: true
      },
      phone: {
        label: 'Numéro de téléphone',
        type: 'phone'
      },
      address: {
        title: 'Adresse postale',
        type: 'subform',
        conf: {
          line1: {
            type: 'text',
            label: 'Ligne 1',
            default: ''
          },
          line2: {
            type: 'text',
            label: 'Ligne 2',
            default: ''
          },
          zipcode: {
            type: 'text',
            label: 'Code postal',
            default: ''
          },
          city: {
            type: 'text',
            label: 'Ville',
            default: ''
          },
          //   state: {
          //     type: 'text',
          //     label: 'État',
          //     default: ''
          //   },
          country: {
            type: 'select',
            label: 'Pays',
            filterable: true,
            default: process.env.DEFAULT_COUNTRY ?? 'US',
            options: Object.entries(
              countries.getNames(process.env.LOCALE ?? 'en', {
                select: 'official'
              })
            ).map(a => ({ label: a[1], value: a[0] }))
          }
        }
      }
    },
    columns: [
      { path: 'avatar', formatter: 'image', float: 'left', width: 50 },
      {
        template: '{{row.firstname}} {{row.lastname}}',
        label: 'Nom',
        sortable: true,
        sortField: 'lastname',
        width: 300
      },
      {
        path: 'email',
        formatter: 'email',
        label: 'Adresse email'
      }
    ]
  }
)
