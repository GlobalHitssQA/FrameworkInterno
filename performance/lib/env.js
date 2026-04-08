// Configuración de entornos para pruebas de performance k6
// Cada entorno define la URL base y los endpoints que se usarán en los escenarios.
// Se puede seleccionar el entorno activo mediante la variable de entorno K6_ENV
// al ejecutar k6, por ejemplo: k6 run -e K6_ENV=staging performance/scenarios/load.js

const environments = {
	dev: {
		rickAndMortyBase: 'https://rickandmortyapi.com/api',
		reqresBase: 'https://reqres.in/api',
		graphqlBase: 'https://rickandmortyapi.com/graphql',
	},
	staging: {
		rickAndMortyBase: 'https://rickandmortyapi.com/api',
		reqresBase: 'https://reqres.in/api',
		graphqlBase: 'https://rickandmortyapi.com/graphql',
	},
	prod: {
		rickAndMortyBase: 'https://rickandmortyapi.com/api',
		reqresBase: 'https://reqres.in/api',
		graphqlBase: 'https://rickandmortyapi.com/graphql',
	},
}

// k6 expone las variables pasadas con -e en el objeto __ENV
const active = (typeof __ENV !== 'undefined' && __ENV.K6_ENV) || 'dev'

if (!environments[active]) {
	throw new Error(
		`Entorno k6 desconocido: "${active}". Entornos disponibles: ${Object.keys(
			environments
		).join(', ')}`
	)
}

export const env = environments[active]
export const envName = active
