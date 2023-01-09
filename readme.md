# azs

azs allows you to add virtual methods to zod schemas, tying data types to functions. here's a small example for a `user` type.

A more advanced example can be found [here](./example/basic.ts).

```ts
import {z} from 'zod';
import azs from 'azs';

const userSchema = z.object({
	age: z.number(),
	name: z.string(),
	github: z.string().url(),
});

const schema = azs(userSchema, {
	isAdult: user => {
		return user.age >= 18;
	},

	is: (user, name: string) => {
		return user.name === name;
	},

	// Or, you can access `this` which will be
	// the parsed value
	getName() {
		return this.name;
	},
});
```
