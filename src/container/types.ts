export interface Container {
  id: string
  names: string
  ports: string
  image: string
  status: string
  runningFor: string
  createdAt: string
}

export interface Stats {
  id: string
  name: string
  cpu: string
  memUsage: string
  netIO: string
  blockIO: string
  memory: string
}
