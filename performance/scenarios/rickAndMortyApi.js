// Escenario realista que replica el flujo del test de backend existente
// (tests/backend_test.ts) usando k6 para medir su performance.
// Incluye llamadas REST (GET, POST, PUT, DELETE) y una consulta GraphQL.
//
// Ejecución:
//   k6 run performance/scenarios/rickAndMortyApi.js
//   npm run k6:api

import { sleep, group } from 'k6'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js'
import { loadOptions } from '../config/options.js'
import { env } from '../lib/env.js'
import {
	httpGet,
	httpPost,
	httpPut,
	httpDelete,
	graphqlQuery,
} from '../lib/helpers.js'

export const options = loadOptions({
	// Este escenario es más representativo de las pruebas end-to-end
	// por eso se usan menos VUs y un ramp-up más controlado.
	stages: [
		{ duration: '30s', target: 10 },
		{ duration: '1m', target: 10 },
		{ duration: '30s', target: 0 },
	],
})

export default function () {
	group('REST - Rick and Morty', () => {
		httpGet(`${env.rickAndMortyBase}/character/`, {}, 200, 'GET /character')
		sleep(1)
	})

	group('REST - Reqres', () => {
		httpPut(
			`${env.reqresBase}/users/2`,
			{ name: 'javier', job: 'zion resident' },
			200,
			'PUT /users/:id'
		)
		sleep(1)

		httpPost(
			`${env.reqresBase}/login`,
			{
				email: 'eve.holt@reqres.in',
				password: 'cityslicka',
			},
			200,
			'POST /login'
		)
		sleep(1)

		httpDelete(`${env.reqresBase}/users/2`, 204, 'DELETE /users/:id')
		sleep(1)
	})

	group('GraphQL - Episodios', () => {
		graphqlQuery(
			env.graphqlBase,
			`{
				episodesByIds(ids: [1, 2]) {
					name
					characters {
						name
					}
				}
			}`,
			{},
			'GRAPHQL episodesByIds'
		)
		sleep(1)
	})
}

export function handleSummary(data) {
	return {
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
		'output/k6/rickandmorty-summary.json': JSON.stringify(data, null, 2),
	}
}
