// Soak / endurance test: mantiene una carga sostenida durante un período largo
// para detectar memory leaks, degradación de rendimiento o errores que sólo
// aparecen tras muchas iteraciones.
//
// Ejecución:
//   k6 run performance/scenarios/soak.js
//   npm run k6:soak

import { sleep, group } from 'k6'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js'
import { soakOptions } from '../config/options.js'
import { env } from '../lib/env.js'
import { httpGet, pickRandom } from '../lib/helpers.js'

export const options = soakOptions()

const characterIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export default function () {
	group('Navegación sostenida en el catálogo', () => {
		httpGet(`${env.rickAndMortyBase}/character/`, {}, 200, 'GET /character')
		sleep(2)

		const id = pickRandom(characterIds)
		httpGet(
			`${env.rickAndMortyBase}/character/${id}`,
			{},
			200,
			'GET /character/:id'
		)
		sleep(2)

		httpGet(`${env.rickAndMortyBase}/episode/`, {}, 200, 'GET /episode')
		sleep(2)
	})
}

export function handleSummary(data) {
	return {
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
		'output/k6/soak-summary.json': JSON.stringify(data, null, 2),
	}
}
