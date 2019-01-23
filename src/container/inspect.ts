import { Client } from 'ssh2'
import { wrapExec } from '../util'
import { ContainerInspectInfo } from 'dockerode'

export async function inspect(client: Client, id: string) {
  const cmd = `docker inspect ${id}`
  const result = await wrapExec(client, cmd)
  const parsed: ContainerInspectInfo[] = JSON.parse(result.join(''))

  return parsed
}
