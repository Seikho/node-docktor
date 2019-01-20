import * as ssh from 'ssh2'
import { Host } from './types'
import { getAll } from './container/get-all'
import { readFileSync } from 'fs'

export async function connect(host: Host) {
  const client = await getClient(host)

  const containers = await getAll(client)
  console.log(containers)
  return client
}

function getClient(host: Host) {
  const client = new ssh.Client()
  client.connect(host)

  const promise = new Promise<ssh.Client>((resolve, reject) => {
    client.on('ready', () => {
      resolve(client)
    })

    client.on('error', error => {
      reject(error)
    })
  })

  return promise
}

connect({
  host: process.env.TEST_HOST || '',
  port: 22,
  privateKey: readFileSync(process.env.TEST_KEY || '').toString(),
  username: process.env.TEST_USER || ''
})
