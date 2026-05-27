import { IInvokableOptions } from "./options";

export function normalizeArgs(args: any) : any

export function normalizeOptions(obj: any, extendWith?: any) : IInvokableOptions;


export function safeInvoke<V, E = Error>(fn: (...args: any[]) => V, options?: IInvokableOptions): [V | undefined, E | undefined];
export function safeInvoke<V, E = Error>(fn: V, options?: IInvokableOptions): [V | undefined, E | undefined];