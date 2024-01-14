import {z} from 'zod';
import {azs} from '../src/index.ts';

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

const user = schema.parse({
	age: 18,
	name: 'Alistair',
	github: 'https://github.com/alii',
});

// Access the methods
console.log('is adult?', user.isAdult() ? 'Yes!' : 'Nope!');
console.log('is John?', user.is('John') ? 'Yes!' : 'Nope!');
console.log('name:', user.getName());

// Safely still access the original properties
console.log('age', user.age);
console.log('name', user.name);
