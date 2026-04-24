// Stress test: empuja el sistema hasta encontrar el punto de quiebre.
// Aumenta los usuarios virtuales de forma progresiva hasta un nivel que
// excede la capacidad esperada del API.
//
// Ejecución:
//   k6 run performance/scenarios/stress.js
//   npm run k6:stress

import { sleep } from 'k6'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js'
import { stressOptions } from '../config/options.js'
import { env } from '../lib/env.js'
import { httpGet, pickRandom } from '../lib/helpers.js'

export const options = stressOptions()

const characterIds = Array.from({ length: 20 }, (_, i) => i + 1)

export default function () {
	const id = pickRandom(characterIds)
	httpGet(
		`${env.rickAndMortyBase}/character/${id}`,
		{},
		200,
		'GET /character/:id'
	)
	httpGet(`${env.rickAndMortyBase}/location/`, {}, 200, 'GET /location')
	httpGet(`${env.rickAndMortyBase}/episode/`, {}, 200, 'GET /episode')
	sleep(1)
}

export function handleSummary(data) {
	return {
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
		'output/k6/stress-summary.json': JSON.stringify(data, null, 2),
	}
}
