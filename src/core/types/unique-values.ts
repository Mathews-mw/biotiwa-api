export type NonEmptyTuple<Value> = readonly [Value, ...Value[]];

export type UniqueValues<
	Values extends readonly string[],
	UsedValues extends string = never,
> = Values extends readonly [infer CurrentValue extends string, ...infer RemainingValues extends readonly string[]]
	? readonly [
			CurrentValue extends UsedValues ? never : CurrentValue,
			...UniqueValues<RemainingValues, UsedValues | CurrentValue>,
		]
	: readonly [];
