export class Result<V = unknown, E = Error> {
  readonly value: V | undefined;
  readonly error: E | null | undefined;
  readonly ok: boolean;
  readonly notOk: boolean;

  constructor(_ok: boolean, arg: V | E);

  isOk() : boolean;

}