import dotenv from 'dotenv'
dotenv.config()

import ngrok from 'ngrok'
import fs from 'fs'

const getNgrok = async () => {
  const url = await ngrok.connect({
    proto: 'http',
    addr: 5173,
    authtoken: process.env.NGROK_AUTH_TOKEN,
  })

  // write to file
  fs.writeFileSync(
    '.sst/beconnected-ngrok.json',
    JSON.stringify({ public_url: url })
  )
}

getNgrok().catch(console.error)
