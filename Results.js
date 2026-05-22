import { Result } from './Result.js';
import { normalizeOptions, parseArgs } from './utils.js';
import { OK, ERR, RES } from './instance-api.js';
import { syncCall, asyncCall, safeInvoke } from './invoke-api.js';

export class Results {

	Class = Result

	normalizeOptions = normalizeOptions

	parseArgs = parseArgs

	OK = OK

	ERR = ERR

	RES = RES
	
	safeInvoke = safeInvoke

	syncCall = syncCall
	sync = syncCall

	asyncCall = asyncCall
	async = asyncCall



}