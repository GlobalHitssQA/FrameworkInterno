// Perfiles de ejecución reutilizables para pruebas de performance k6.
// Cada función devuelve un objeto compatible con la propiedad `options`
// de un script k6. Así los escenarios pueden concentrarse solo en su lógica
// y reutilizar la configuración de stages, thresholds y tags.

const baseThresholds = {
	// El 95% de las peticiones debe responder en menos de 1.5s
	http_req_duration: ['p(95)<1500'],
	// Menos del 1% de las peticiones pueden fallar
	http_req_failed: ['rate<0.01'],
	// La tasa de error personalizada no debe superar el 1%
	api_error_rate: ['rate<0.01'],
	// Los checks configurados deben pasar al menos en un 99%
	checks: ['rate>0.99'],
}

/**
 * Smoke test: valida que el sistema responde correctamente con carga mínima.
 * Se ejecuta rápido y sirve para comprobar humo antes de cargas más pesadas.
 */
export function smokeOptions(extra = {}) {
	return {
		vus: 1,
		duration: '30s',
		thresholds: {
			...baseThresholds,
			// En smoke somos más estrictos: todas las peticiones deben ser rápidas
			http_req_duration: ['p(95)<1000'],
		},
		tags: { test_type: 'smoke' },
		...extra,
	}
}

/**
 * Load test: simula la carga esperada en un día promedio.
 */
export function loadOptions(extra = {}) {
	return {
		stages: [
			{ duration: '30s', target: 20 },
			{ duration: '1m', target: 20 },
			{ duration: '30s', target: 0 },
		],
		thresholds: baseThresholds,
		tags: { test_type: 'load' },
		...extra,
	}
}

/**
 * Stress test: incrementa la carga hasta encontrar el punto de quiebre.
 */
export function stressOptions(extra = {}) {
	return {
		stages: [
			{ duration: '1m', target: 50 },
			{ duration: '2m', target: 100 },
			{ duration: '2m', target: 200 },
			{ duration: '1m', target: 300 },
			{ duration: '1m', target: 0 },
		],
		thresholds: {
			...baseThresholds,
			// En stress relajamos: aceptamos 5% de errores y p95 más alto
			http_req_failed: ['rate<0.05'],
			http_req_duration: ['p(95)<3000'],
			api_error_rate: ['rate<0.05'],
		},
		tags: { test_type: 'stress' },
		...extra,
	}
}

/**
 * Spike test: simula un pico súbito de usuarios.
 */
export function spikeOptions(extra = {}) {
	return {
		stages: [
			{ duration: '10s', target: 10 },
			{ duration: '30s', target: 500 },
			{ duration: '10s', target: 10 },
			{ duration: '10s', target: 0 },
		],
		thresholds: {
			...baseThresholds,
			http_req_failed: ['rate<0.1'],
			http_req_duration: ['p(95)<5000'],
			api_error_rate: ['rate<0.1'],
		},
		tags: { test_type: 'spike' },
		...extra,
	}
}

/**
 * Soak test: mantiene una carga sostenida para detectar memory leaks
 * o degradación del sistema a lo largo del tiempo.
 */
export function soakOptions(extra = {}) {
	return {
		stages: [
			{ duration: '2m', target: 30 },
			{ duration: '10m', target: 30 },
			{ duration: '2m', target: 0 },
		],
		thresholds: baseThresholds,
		tags: { test_type: 'soak' },
		...extra,
	}
}
