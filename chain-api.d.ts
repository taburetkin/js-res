// chain-api.d.ts

export class ChainResult<T = any, E = Error> extends Result<T, E> {
  
  // При переходе к новому звену NT выводится из функции, а E сохраняется
  syncChain<NT>(
    arg: NT | ((value: T, res: this) => NT),
    options?: IResultOptions<NT, E>
  ): ChainResult<NT extends Result<infer U, any> ? U : NT, E>;

}
