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

export type Output = { [tag: string]: string }

export function parseLine(tags: Tag[], line: string) {
  const split = line.split('|')
  return split.reduce<Output>((prev, curr, index) => {
    const key = tags[index].name
    prev[key] = curr
    return prev
  }, {})
}

export function parseLines(tags: Tag[], lines: string[]) {
  return lines.map(line => parseLine(tags, line))
}
