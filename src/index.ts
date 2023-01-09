import {type z} from 'zod';

export type MethodInit<T> = Record<string, (this: T, value: T, ...args: any[]) => any>;

export type DropFirstTuple<T extends any[]> = T extends [any, ...infer R] ? R : never;

export function azs<Out, Def extends z.ZodTypeDef, In, M extends MethodInit<Out>>(
	schema: z.Schema<Out, Def, In>,
	methods: M
) {
	return schema.transform(value => {
		type Methods = {
			[Key in keyof M]: (...args: DropFirstTuple<Parameters<M[Key]>>) => ReturnType<M[Key]>;
		};

		// @ts-expect-error Keys are passed in the next lines
		const methodsResult: Methods = {};

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

export default azs;
