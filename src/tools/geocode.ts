import axios from 'axios'

interface GeocodeAddress {
  street: string
  postalcode: string
  city: string
  country: string
  state: string
}

async function execute (addr: GeocodeAddress) {
  let pos = null
  if (!(addr.city ?? '').length) pos = { data: [{ lat: 0, lon: 0 }] }
  else {
    pos = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        ...addr,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': process.env.APP_TITLE
      }
    })
  }

  if (!pos.data.length) pos = { data: [{ lat: 0, lon: 0 }] }

  return [parseFloat(pos.data[0].lon), parseFloat(pos.data[0].lat)]
}

export async function geocode (addr: GeocodeAddress) {
  addr.street = addr.street.trim()
  addr.city = addr.city
    .split(' ')
    .filter(a => /[0-9]/.test(a) === false)
    .join(' ')
    .trim()
  addr.state = ''

  let coordinates = await execute(addr)
  if (coordinates[0] === 0 && coordinates[1] === 0)
    coordinates = await execute({
      ...addr,
      street: ''
    })
  if (coordinates[0] === 0 && coordinates[1] === 0)
    coordinates = await execute({
      ...addr,
      street: '',
      postalcode: ''
    })
  if (coordinates[0] === 0 && coordinates[1] === 0)
    coordinates = await execute({
      ...addr,
      street: '',
      postalcode: '',
      country: ''
    })

  return coordinates
}
