// Spike test: simula un pico súbito de usuarios (p. ej. campaña de marketing
// o evento viral). Sirve para detectar cómo reacciona el sistema ante cambios
// bruscos de carga y si logra recuperarse una vez que el pico pasa.
//
// Ejecución:
//   k6 run performance/scenarios/spike.js
//   npm run k6:spike

import { sleep } from 'k6'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js'
import { spikeOptions } from '../config/options.js'
import { env } from '../lib/env.js'
import { httpGet } from '../lib/helpers.js'

export const options = spikeOptions()

export default function () {
	httpGet(`${env.rickAndMortyBase}/character/`, {}, 200, 'GET /character')
	sleep(0.5)
}

export function handleSummary(data) {
	return {
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
		'output/k6/spike-summary.json': JSON.stringify(data, null, 2),
	}
}
