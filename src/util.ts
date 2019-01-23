import { Client, ClientChannel } from 'ssh2'

export function wrapExec(client: Client, command: string) {
  return new Promise<string[]>((resolve, reject) => {
    client.exec(command, (err, ch) => {
      if (err) {
        return reject(err)
      }

      const lines: string[] = []
      ch.on('close', () => resolve(lines))
      ch.on('data', (data: Buffer) => {
        const result = data
          .toString()
          .split('\n')
          .filter(row => !!row)
        lines.push(...result)
      })
    })
  })
}

export function wrapStream(client: Client, command: string) {
  return new Promise<ClientChannel>((resolve, reject) => {
    client.exec(command, (err, ch) => {
      if (err) {
        return reject(err)
      }

      resolve(ch)
    })
  })
}

export type Tag = { name: string; tag: string }

export function toFormatting(tags: Tag[]) {
  return tags.map(tag => `{{${tag.tag}}}`).join('|')
}

export type Output<T> = { [tag in keyof T]: string }

export function parseLine<T>(tags: Tag[], line: string) {
  const split = line
    .replace(/[\u{0080}-\u{FFFF}]/gu, '')
    .replace('[2J[H', '')
    .split('|')
  return split.reduce<Output<T>>(
    (prev, curr, index) => {
      const key = tags[index].name as keyof T
      const value = key === 'id' ? curr.replace(/\W/g, '') : curr
      prev[key] = value
      return prev
    },
    {} as Output<T>
  )
}

export function parseLines<T>(tags: Tag[], lines: string[]) {
  return lines.map(line => parseLine<T>(tags, line))
}

let timerCount = 0
export function getTimer(name: string) {
  const count = ++timerCount
  const start = Date.now()
  return () => console.log(`${name}-${count} ${Date.now() - start}ms`)
}
