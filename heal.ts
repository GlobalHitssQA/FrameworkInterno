import { heal, ai } from 'codeceptjs/lib'

heal.addRecipe('ai', {
	priority: 10,
	prepare: {
		html: ({ I }) => I.grabHTMLFrom('body'),
	},
	suggest: true,
	steps: [
		'click',
		'fillField',
		'appendField',
		'selectOption',
		'attachFile',
		'checkOption',
		'uncheckOption',
		'doubleClick',
	],
	fn: async (args) => ai.healFailedStep(args),
})
