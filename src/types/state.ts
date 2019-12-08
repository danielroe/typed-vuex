import { Not } from './utilities'

type StateObject = Not<Record<string, any>, Function>
type StateFunction = Not<() => unknown | any, Record<string, any>>

export type State = StateObject | StateFunction
export type StateType<T extends State> = T extends () => any ? ReturnType<T> : T
