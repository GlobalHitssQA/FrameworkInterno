// Load test: simula la carga esperada en un día promedio.
// Combina operaciones GET y POST para ejercitar varias rutas del API.
//
// Ejecución:
//   k6 run performance/scenarios/load.js
//   npm run k6:load

import { sleep, group } from 'k6'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js'
import { loadOptions } from '../config/options.js'
import { env } from '../lib/env.js'
import { httpGet, httpPost, pickRandom } from '../lib/helpers.js'

export const options = loadOptions()

const characterIds = [1, 2, 3, 4, 5, 10, 15, 20]

export default function () {
	group('Rick and Morty - listado y detalle', () => {
		httpGet(`${env.rickAndMortyBase}/character/`, {}, 200, 'GET /character')
		sleep(1)

		const id = pickRandom(characterIds)
		httpGet(
			`${env.rickAndMortyBase}/character/${id}`,
			{},
			200,
			'GET /character/:id'
		)
		sleep(1)
	})

	group('Reqres - login', () => {
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
	})
}

export function handleSummary(data) {
	return {
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
		'output/k6/load-summary.json': JSON.stringify(data, null, 2),
	}
}
