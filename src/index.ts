import {type z} from 'zod';

export type MethodInit<T> = Record<string, (this: T, value: T, ...args: any[]) => any>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type DropFirstTuple<T extends any[]> = T extends [any, ...infer R] ? R : [];

/**
 * Create a new Zod schema that resolves to an object with the methods added, and typed correctly
 * @param schema A zod schema to add methods to
 * @param methods An object of methods to add to the schema
 * @returns A new instanceof a zod schema, with the methods added once parsed succesfully
 */
export function azs<Out, Def extends z.ZodTypeDef, In, M extends MethodInit<Out>>(
	schema: z.Schema<Out, Def, In>,
	methods: M,
) {
	return schema.transform(value => {
		// @ts-expect-error Keys are passed in the next lines
		const methodsResult: {
			[Key in keyof M]: (...args: DropFirstTuple<Parameters<M[Key]>>) => ReturnType<M[Key]>;
		} = {};

		for (const key in methods) {
			if (!(key in methods)) {
				continue;
			}

			const method = methods[key];

			methodsResult[key] = (...args) =>
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				method.call(value, value, ...args) as ReturnType<M[keyof M]>;
		}

		return {
			...value,
			...methodsResult,
		};
	});
}
