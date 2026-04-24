// Helpers reutilizables para los escenarios de k6.
// Estas funciones estandarizan la forma en que se realizan peticiones HTTP
// y se evalúan las respuestas, lo que permite mantener los escenarios
// limpios y enfocados en la lógica de negocio.

import http from 'k6/http'
import { check, fail } from 'k6'
import { Trend, Counter, Rate } from 'k6/metrics'

// Métricas personalizadas para añadir visibilidad al reporte final
export const apiLatency = new Trend('api_latency', true)
export const apiErrors = new Counter('api_errors')
export const apiErrorRate = new Rate('api_error_rate')

// Headers estándar para las peticiones JSON
export const jsonHeaders = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
}

/**
 * Ejecuta un GET y valida el código HTTP esperado.
 * Registra métricas personalizadas para trazabilidad.
 */
export function httpGet(url, params = {}, expectedStatus = 200, tagName = 'GET') {
	const res = http.get(url, { headers: jsonHeaders, ...params, tags: { name: tagName } })

	const ok = check(res, {
		[`${tagName} - status ${expectedStatus}`]: (r) => r.status === expectedStatus,
		[`${tagName} - response time < 2s`]: (r) => r.timings.duration < 2000,
	})

	apiLatency.add(res.timings.duration, { endpoint: tagName })
	apiErrorRate.add(!ok)
	if (!ok) {
		apiErrors.add(1, { endpoint: tagName })
	}

	return res
}

/**
 * Ejecuta un POST con body JSON y valida el estado esperado.
 */
export function httpPost(url, body, expectedStatus = 200, tagName = 'POST') {
	const res = http.post(url, JSON.stringify(body), {
		headers: jsonHeaders,
		tags: { name: tagName },
	})

	const ok = check(res, {
		[`${tagName} - status ${expectedStatus}`]: (r) => r.status === expectedStatus,
	})

	apiLatency.add(res.timings.duration, { endpoint: tagName })
	apiErrorRate.add(!ok)
	if (!ok) {
		apiErrors.add(1, { endpoint: tagName })
	}

	return res
}

/**
 * Ejecuta un PUT con body JSON y valida el estado esperado.
 */
export function httpPut(url, body, expectedStatus = 200, tagName = 'PUT') {
	const res = http.put(url, JSON.stringify(body), {
		headers: jsonHeaders,
		tags: { name: tagName },
	})

	const ok = check(res, {
		[`${tagName} - status ${expectedStatus}`]: (r) => r.status === expectedStatus,
	})

	apiLatency.add(res.timings.duration, { endpoint: tagName })
	apiErrorRate.add(!ok)
	if (!ok) {
		apiErrors.add(1, { endpoint: tagName })
	}

	return res
}

/**
 * Ejecuta un DELETE y valida el estado esperado.
 */
export function httpDelete(url, expectedStatus = 204, tagName = 'DELETE') {
	const res = http.del(url, null, {
		headers: jsonHeaders,
		tags: { name: tagName },
	})

	const ok = check(res, {
		[`${tagName} - status ${expectedStatus}`]: (r) => r.status === expectedStatus,
	})

	apiLatency.add(res.timings.duration, { endpoint: tagName })
	apiErrorRate.add(!ok)
	if (!ok) {
		apiErrors.add(1, { endpoint: tagName })
	}

	return res
}

/**
 * Ejecuta una consulta GraphQL y valida la respuesta.
 */
export function graphqlQuery(endpoint, query, variables = {}, tagName = 'GRAPHQL') {
	const payload = JSON.stringify({ query, variables })
	const res = http.post(endpoint, payload, {
		headers: jsonHeaders,
		tags: { name: tagName },
	})

	const ok = check(res, {
		[`${tagName} - status 200`]: (r) => r.status === 200,
		[`${tagName} - no GraphQL errors`]: (r) => {
			try {
				const body = r.json()
				return !body.errors || body.errors.length === 0
			} catch (_e) {
				return false
			}
		},
	})

	apiLatency.add(res.timings.duration, { endpoint: tagName })
	apiErrorRate.add(!ok)
	if (!ok) {
		apiErrors.add(1, { endpoint: tagName })
	}

	return res
}

/**
 * Aborta el VU actual con un mensaje claro cuando un precondición no se cumple.
 */
export function abortIf(condition, message) {
	if (condition) {
		fail(message)
	}
}

/**
 * Selecciona un elemento aleatorio de un arreglo.
 */
export function pickRandom(items) {
	if (!items || items.length === 0) return undefined
	return items[Math.floor(Math.random() * items.length)]
}
