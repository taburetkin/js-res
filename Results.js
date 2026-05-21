import { Result } from './Result.js';
import { normalizeOptions, parseArgs } from './utils.js';
import { _ok, _err, _toResult } from './instance-api.js';
import { _syncCall, _asyncCall, _safeInvoke } from './invoke-api.js';

export class Results {

	Class = Result

	normalizeOptions = normalizeOptions

	parseArgs = parseArgs

	OK = _ok

	ERR = _err

	toResult = _toResult
	
	safeInvoke = _safeInvoke

	sync = _syncCall

	async = _asyncCall
}