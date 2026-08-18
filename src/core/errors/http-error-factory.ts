import z from 'zod';

import type { NonEmptyTuple, UniqueValues } from '../types/unique-values';

export type IHttpErrorFactoryOptions<
	Status extends number,
	Codes extends NonEmptyTuple<string>,
	DefaultCode extends Codes[number],
> = {
	status: Status;
	codes: Codes;
	defaultCode: DefaultCode;
};

export function createHttpErrorSchemaFactory<
	const Status extends number,
	const Codes extends NonEmptyTuple<string>,
	const DefaultCode extends Codes[number],
>({ status, codes, defaultCode }: IHttpErrorFactoryOptions<Status, Codes, DefaultCode>) {
	type Code = Codes[number];

	const enumCodes = [...codes] as [Code, ...Code[]];

	const codeSchema = z.enum(enumCodes).default(defaultCode);

	const errorSchema = z.object({
		status: z.literal(status),
		message: z.string(),
		code: codeSchema,
	});

	function buildErrorSchema<const SelectedCodes extends NonEmptyTuple<Code>>(selectedCodes: SelectedCodes) {
		const normalizedCodes = [...new Set(selectedCodes)] as unknown as [
			SelectedCodes[number],
			...SelectedCodes[number][],
		];

		return z.object({
			status: z.literal(status),
			message: z.string(),
			code: z.enum(normalizedCodes),
		});
	}

	type ErrorCodeSelection<SelectedCodes extends NonEmptyTuple<Code>> = {
		include<const NextCode extends Exclude<Code, SelectedCodes[number]>>(
			code: NextCode
		): ErrorCodeSelection<readonly [...SelectedCodes, NextCode]>;

		getErrorSchema(): ReturnType<typeof buildErrorSchema<SelectedCodes>>;
	};

	function createSelection<const SelectedCodes extends NonEmptyTuple<Code>>(
		selectedCodes: SelectedCodes
	): ErrorCodeSelection<SelectedCodes> {
		return {
			include<const NextCode extends Exclude<Code, SelectedCodes[number]>>(nextCode: NextCode) {
				const nextSelectedCodes = [...selectedCodes, nextCode] as unknown as readonly [...SelectedCodes, NextCode];

				return createSelection(nextSelectedCodes);
			},

			getErrorSchema() {
				return buildErrorSchema(selectedCodes);
			},
		};
	}

	function startWith<const FirstCode extends Code>(firstCode: FirstCode): ErrorCodeSelection<readonly [FirstCode]> {
		return createSelection([firstCode] as readonly [FirstCode]);
	}

	function getErrorSchema(): ReturnType<typeof buildErrorSchema<readonly [DefaultCode]>>;

	function getErrorSchema<const SelectedCodes extends NonEmptyTuple<Code>>(
		selectedCodes: SelectedCodes & UniqueValues<SelectedCodes>
	): ReturnType<typeof buildErrorSchema<SelectedCodes>>;

	function getErrorSchema(selectedCodes?: NonEmptyTuple<Code>) {
		const effectiveCodes = selectedCodes ?? ([defaultCode] as readonly [DefaultCode]);

		return buildErrorSchema(effectiveCodes);
	}

	return {
		status,
		codes,
		defaultCode,
		codeSchema,
		errorSchema,
		getErrorSchema,
		startWith,
	};
}
