import { Client } from 'ssh2'
import { toFormatting, wrapExec, parseLines } from '../util'

const tags = [
  { name: 'id', tag: '.ID' },
  { name: 'names', tag: '.Names' },
  { name: 'ports', tag: '.Ports' },
  { name: 'images', tag: '.Image' },
  { name: 'status', tag: '.Status' },
  { name: 'runningFor', tag: '.RunningFor' },
  { name: 'createdAt', tag: '.CreatedAt' }
]

const format = toFormatting(tags)

export async function getAll(client: Client) {
  const cmd = `sudo docker ps --format "${format}"`
  const result = await wrapExec(client, cmd)
  const lines = parseLines(tags, result)
  return lines
}
