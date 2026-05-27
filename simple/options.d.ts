import { CoreResult } from "./CoreResult";

export interface IInvokableOptions
{
	invokeContext?: any;
	invokeArgs?: any[] | any;
}

export interface IResultOptions<V, E, R extends CoreResult<V, E>> 
	extends IInvokableOptions
{
	init?: (res: R) => void;
	[key: string] : any
}

