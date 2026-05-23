import { expectType } from 'tsd';
import { OK, ERR, Result } from '../../../index.js';

const okResult = OK('hello');
const errResult = ERR(500);

// match with ok
const matchResult = okResult.match({
    ok: (value, result) => {
        expectType<string>(value);
        expectType<Result<string, never>>(result);
        return value.length;
    },
    err: (error, result) => {
        expectType<never>(error);
        expectType<Result<string, never>>(result);
        return 0;
    }
});
expectType<number>(matchResult);

// match with err
const matchErrResult = errResult.match({
    ok: (value, result) => {
        expectType<never>(value);
        expectType<Result<never, number>>(result);
        return 'success';
    },
    err: (error, result) => {
        expectType<number>(error);
        expectType<Result<never, number>>(result);
        return `Error: ${error}`;
    }
});
expectType<string>(matchErrResult);

// fold with ok
const foldResult = okResult.fold(
    (value, result) => {
        expectType<string>(value);
        expectType<Result<string, never>>(result);
        return value.toUpperCase();
    },
    (error, result) => {
        expectType<never>(error);
        expectType<Result<string, never>>(result);
        return '';
    }
);
expectType<string>(foldResult);

// fold with err
const foldErrResult = errResult.fold(
    (value, result) => {
        expectType<never>(value);
        expectType<Result<never, number>>(result);
        return 0;
    },
    (error, result) => {
        expectType<number>(error);
        expectType<Result<never, number>>(result);
        return error * 2;
    }
);
expectType<number>(foldErrResult);