# azs

azs allows you to add virtual methods to zod schemas, tying data types to functions. here's a small example for a `user` type.

A more advanced example can be found [here](./example/basic.ts).

```ts
import {z} from 'zod';
import {azs} from 'azs';

const userSchema = z.object({
	age: z.number(),
	name: z.string(),
	github: z.string().url(),
});

const schema = azs(userSchema, {
	// Basic example
	isAdult: user => {
		return user.age >= 18;
	},

	// Methods can take arguments, but the
	// first argument will always be the parsed
	// value. You don't have to specify a type
	// for the first argument.
	is: (user, name: string) => {
		return user.name === name;
	},

	// Or, you can access `this` which will be
	// the parsed value. Notice how this is a
	// method, not an arrow function property.
	getName() {
		return this.name;
	},
});

const user = schema.parse(someRandomJSONThatMightBeAUser);

user.isAdult();
user.getName();
user.is('Colin McDonnell');
```
