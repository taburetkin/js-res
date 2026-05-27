import { Result } from "../simple/Result.js";
import { IResultOptions } from "../simple/options.js";

/**
 * 1. АСИНХРОННАЯ ЦЕПОЧКА (Возникает ТОЛЬКО после mapAsync)
 * Она инкапсулирует Promise внутри себя.
 */
export class AsyncChainResult<V, E> extends Result<Promise<V>, E> {
	// В асинхронной цепи map принимает чистый V (так как промис разворачивается)
	// но возвращает AsyncChainResult, сохраняя асинхронность
	map<U>(fn: (value: V) => U, options?: IResultOptions<U, E, any>): AsyncChainResult<U, E>;
	
	// mapAsync продолжает асинхронную цепь
	mapAsync<U>(fn: (value: V) => Promise<U> | U, options?: IResultOptions<U, E, any>): AsyncChainResult<U, E>;
	
	// Финальный выход из асинхронного контекста
	await(): Promise<Result<V, E>>;
}

/**
 * 2. СИНХРОННАЯ ЦЕПОЧКА (Точка входа по умолчанию)
 * Работает с обычным плоским значением V.
 */
export class ChainResult<V, E> extends Result<V, E> {
	/**
	 * Полностью синхронный маппинг. 
	 * Возвращает обычный синхронный ChainResult. Никаких промисов!
	 */
	map<U>(fn: (value: V) => U, options?: IResultOptions<U, E, any>): this & ChainResult<U, E>;

	/**
	 * ТОЧКА ПЕРЕХОДА: Этот метод "взрывает" синхронную цепь 
	 * и переводит её на рельсы AsyncChainResult!
	 */
	mapAsync<U>(
		fn: (value: V) => Promise<U> | U, 
		options?: IResultOptions<U, E, any>
	): AsyncChainResult<U, E>; // <-- Магия тут! Тип изменился на асинхронный.

	// В синхронной цепи await не нужен, но для безопасности можно вернуть Promise от текущего значения
	await(): Promise<Result<V, E>>;
}
