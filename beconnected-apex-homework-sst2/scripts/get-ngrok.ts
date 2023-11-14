import axios from 'axios'

const getNgrok = async () => {
  const { data } = await axios.get('http://127.0.0.1:4040/api/tunnels')

  const { public_url } = data.tunnels[0]
  // write to file
  const fs = require('fs')
  fs.writeFileSync(
    '.sst/beconnected-ngrok.json',
    JSON.stringify({ public_url })
  )
}

getNgrok().catch(console.error)
