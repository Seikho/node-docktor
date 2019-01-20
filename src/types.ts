export interface Host {
  host: string

  /** Defaults to port 22 */
  port?: number

  username: string
  privateKey: string
}
