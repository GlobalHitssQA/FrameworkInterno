// @ts-ignore-file
import {
	mockDataForPokemon,
	mockIncorrectDataForPokemon,
	mockForJSON,
	mockForPutRequest,
} from './mocksForBackend'

Feature('Pruebas de backend APIs REST y GRAPHQL con assertions')

Scenario('Test of backend REST GET', async ({ I }) => {
	const response = await I.sendGetRequest(
		'https://pokeapi.co/api/v2/pokemon/ditto'
	)

	I.assertEqual(response?.status, 200)
	I.seeResponseCodeIs(200)
	I.assertEqual(response?.data?.abilities?.[0]?.ability?.name, 'limber')
	I.assertNotEqual(response?.data?.abilities?.[0]?.ability?.name, 'Rick Sanez')
	I.assertDeepEqual(response?.data?.abilities, mockDataForPokemon)
	I.assertNotDeepEqual(response?.data?.results?.[1], mockIncorrectDataForPokemon)
	I.assertJsonSchema(response?.data, mockIncorrectDataForPokemon)
// @ts-ignore-start
	I.seeResponseMatchesJsonSchema(($ : any) => {
		return $.object(
				user: $.object({
				  name: $.string(),
			    }),	
			projects: $.array()
			)
		});
// @ts-ignore-end
/*	
	
	

	// Validar tipo de Dato
	I.assertToBeA(response?.data?.results?.[0]?.name, 'string')
	I.assertToBeA(response?.data?.results?.[0]?.id, 'number')*/
})
/*
Scenario('Test of backend REST PUT', async ({ I }) => {
	const response = await I.sendPutRequest('https://reqres.in/api/users/2', {
		name: 'javier',
		job: 'zion resident',
	})

	// Validamos el codigo de respuesta correcto
	I.assertEqual(response?.status, 200)

	// Validamos respuesta
	I.assertEqual(response?.data?.name, 'javier')
	I.assertEqual(response?.data?.job, 'zion resident')

	// Validamos todo el Json
	I.assertJsonSchema(response?.data, mockForPutRequest)
})

Scenario('Test of backend REST PATCH', async ({ I }) => {
	const response = await I.sendPatchRequest('https://reqres.in/api/users/2', {
		name: 'javier',
	})

	// Validamos el codigo de respuesta correcto
	I.assertEqual(response?.status, 200)

	// Validamos respuesta
	I.assertEqual(response?.data?.name, 'javier')

	// Validamos campo updatedAt porque no sabemos el timestamp con exactitud
	I.assertHasProperty(response?.data, 'updatedAt')
})

Scenario('Test of backend REST POST', async ({ I }) => {
	const response = await I.sendPostRequest('https://reqres.in/api/login', {
		email: 'eve.holt@reqres.in',
		password: 'cityslicka',
	})

	// Validamos el codigo de respuesta correcto
	I.assertEqual(response?.status, 200)

	// Validamos token simepre regresa el mismo proque es una API de prueba
	I.assertEqual(response?.data?.token, 'QpwL5tke4Pnpja7X4')

	// Validamos campo token porque no sabemos el timestamp con exactitud
	I.assertHasProperty(response?.data, 'token')
})

Scenario('Test of backend REST DELETE', async ({ I }) => {
	const response = await I.sendDeleteRequest('https://reqres.in/api/users/2')

	// Validamos el codigo de respuesta correcto y no regresa nada
	I.assertEqual(response?.status, 204)
})

Scenario('Test of backend GRAPHQL GET', async ({ I }) => {
	const response = await I.sendQuery(`
	{episodesByIds(ids: [1, 2]) {
		name
		characters {
		  name
		}
  }}`)

	// Validamos el codigo de respuesta correcto y no regresa nada
	I.assertEqual(response?.status, 200)
	I.assertEqual(response?.data?.data?.episodesByIds?.[0]?.name, 'Pilot')
})

Scenario('Test of backend GRAPHQL GET with variables', async ({ I }) => {
	const response = await I.sendQuery(
		`
			 query getEpisodes($ids:[ID!]!) {
				episodesByIds(ids: $ids) {
					name
					characters {
					  name
					}
				}
		  }
  `,
		{
			ids: [1, 2],
		}
	)

	// Validamos el codigo de respuesta correcto y no regresa nada
	I.assertEqual(response?.status, 200)
	I.assertEqual(response?.data?.data?.episodesByIds?.[0]?.name, 'Pilot')
})

// eslint-disable-next-line codeceptjs/no-skipped-tests
Scenario.skip(
	'Test of backend GRAPHQL Mutation with variables',
	async ({ I }) => {
		// Este ejemplo no funciona ya que no hay o encontre APIs publicas para probar mutaciones pero este ejemplo deberia funcionar
		const response = await I.sendMutation(
			`
						  mutation createUser($user: UserInput!) {
							 createUser(user: $user) {
							   id
							   name
							   email
							 }
						   }
   `,
			{
				user: {
					name: 'John Doe',
					email: 'john@xmail.com',
				},
			}
		)

		// Validamos el codigo de respuesta correcto y no regresa nada
		I.assertEqual(response?.status, 204)
	}
)
*/