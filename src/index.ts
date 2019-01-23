import * as ssh from 'ssh2'
import { Host } from './types'
import { create } from './container'

export async function connect(host: Host) {
  const client = await getClient(host)
  const container = create(client)

  return {
    container
  }
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
