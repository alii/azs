# azs

azs allows you to add virtual methods to zod schemas, tying data types to functions. here's a small example for a `user` type

```ts
import {z} from 'zod';
import azs from 'azs';

const userSchema = z.object({
	age: z.number(),
	name: z.string(),
	github: z.string().url(),
});

const {parse} = azs(userSchema, {
	isAdult(user) {
		return user.age >= 18;
	},
	async getFromDB(user) {
		// Example to represent finding from a database
		return {id: 1, name: user.name};
	},
});

// Untrusted, unknown data type
const result = await fetch('https://api.example.com/users/1').then(res => res.json());

const user = parse(result);

const isAdult = user.isAdult() ? 'Yes!' : 'Nope!';

void user.getFromDB().then(result => {
	console.log(result.id, 'is over an adult?', isAdult);
	console.log('raw data', user._data);
});
```
