import { Status } from './status'

export type ReducerType<T> = {
  getStatus: Status
  resource: T
}
