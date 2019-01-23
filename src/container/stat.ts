import { Client } from 'ssh2'
import { wrapStream, parseLines, toFormatting } from '../util'
import { Stats } from './types'

const tags = [
  { name: 'id', tag: '.ID' },
  { name: 'name', tag: '.Name' },
  { name: 'cpu', tag: '.CPUPerc' },
  { name: 'memUsage', tag: '.MemUsage' },
  { name: 'netIO', tag: '.NetIO' },
  { name: 'blockIO', tag: '.BlockIO' },
  { name: 'memory', tag: '.MemPerc' }
]

export type StatsCallback = (stats: Stats[]) => any

const format = toFormatting(tags)
export async function getStats(client: Client, cb: StatsCallback) {
  const cmd = `docker stats --format "${format}"`
  const stream = await wrapStream(client, cmd)
  stream.on('error', console.error)
  stream.on('data', (data: Buffer) => {
    const splits = data
      .toString()
      .split('\n')
      .filter(isValid)

    if (!splits.length) {
      return
    }

    const parsed = parseLines<Stats>(tags, splits)
    cb(parsed)
  })
}

function isValid(line: string) {
  return !!line && line.indexOf('|') > -1
}
