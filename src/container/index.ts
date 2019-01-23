import { Client } from 'ssh2'
import { getAll } from './get-all'
import { inspect } from './inspect'
import { getStats, StatsCallback } from './stat'

export function create(client: Client) {
  return {
    getAll: () => getAll(client),
    inspect: (id: string) => inspect(client, id),
    stats: (cb: StatsCallback) => getStats(client, cb)
  }
}
