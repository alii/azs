import {z} from 'zod';
import {JsonValue} from 'type-fest';

type SchemaFor<T> = z.ZodType<T, z.ZodTypeDef, T>;

type Struct<Schema extends SchemaFor<JsonValue>> = Record<
	string,
	(value: z.infer<Schema>) => unknown
>;

export function azs<Schema extends SchemaFor<JsonValue>, Methods extends Struct<Schema>>(
	schema: Schema,
	// Nice hack to show readible error messages
	methods: Methods extends Record<'_data', unknown>
		? 'You cannot call a method _data. Please rename _data to something else! _data is reserved for accessing the parsed result.'
		: Methods
) {
	return {
		schema,
		parse(raw: unknown) {
			const result = schema.parse(raw) as z.infer<Schema>;

			type Res = {
				[Key in keyof Methods]: () => ReturnType<Methods[Key]>;
			};

			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			const value: Res = {} as Res;

			for (const key in methods) {
				if (!(key in methods)) {
					continue;
				}

				const method = methods[key];

				value[key] = () => method(result) as ReturnType<Methods[typeof key]>;
			}

			return {
				...value,
				_data: result,
			};
		},
	};
}

export default azs;
