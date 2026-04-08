// Smoke test para validar que los endpoints del API respondan correctamente
// ante una carga mínima. Es la primera prueba que se debe ejecutar antes de
// lanzar cargas más altas (load, stress, spike, soak).
//
// Ejecución:
//   k6 run performance/scenarios/smoke.js
//   npm run k6:smoke

import { sleep } from 'k6'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js'
import { smokeOptions } from '../config/options.js'
import { env } from '../lib/env.js'
import { httpGet } from '../lib/helpers.js'

export const options = smokeOptions()

export default function () {
	httpGet(`${env.rickAndMortyBase}/character/`, {}, 200, 'GET /character')
	sleep(1)

	httpGet(`${env.rickAndMortyBase}/character/1`, {}, 200, 'GET /character/:id')
	sleep(1)
}

export function handleSummary(data) {
	return {
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
		'output/k6/smoke-summary.json': JSON.stringify(data, null, 2),
	}
}
