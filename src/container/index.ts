import { Client } from 'ssh2'

export class Container {
  constructor(public client: Client) {}

  getContainers = async () => {}
}
