import { expectType, expectError } from 'tsd';
import { OK, ERR, Result } from '../../index.js';

// match with object handlers
const okResult = OK('hello');
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

// match with error result
const errResult = ERR(500);
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

// fold with function handlers
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

// fold with error result
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