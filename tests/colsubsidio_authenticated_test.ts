/* eslint-disable codeceptjs/no-actor-in-scenario */
import assert from 'assert'
import { colsubsidioCases, ColsubsidioPortal } from './colsubsidioCases'

type ReadOnlyCheck = {
	portal: ColsubsidioPortal
	id: number
	actions: string[]
	expected: string[]
}

const checks: ReadOnlyCheck[] = [
	{
		portal: 'personas',
		id: 33,
		actions: ['Descarga', 'Certificados de afiliación y subsidios'],
		expected: ['Tipo de certificado', 'información', 'empresa'],
	},
	{
		portal: 'personas',
		id: 32,
		actions: ['Ir a mi perfil'],
		expected: ['Grupo familiar'],
	},
	{
		portal: 'personas',
		id: 34,
		actions: ['Ir a mi perfil', 'Mis solicitudes'],
		expected: ['Radicado', 'Fecha', 'Estado'],
	},
	{
		portal: 'personas',
		id: 37,
		actions: [],
		expected: [
			'Ir al perfil',
			'Certificado de afiliación',
			'Afiliar Beneficiarios',
			'Solicitud Cupo Crédito',
		],
	},
	{
		portal: 'personas',
		id: 38,
		actions: ['Mis productos'],
		expected: ['Mis créditos', 'Seguros', 'Vivienda'],
	},
	{
		portal: 'personas',
		id: 39,
		actions: ['Subsidios'],
		expected: ['Mis subsidios', 'Subsidio familiar', 'Bono escolar'],
	},
	{
		portal: 'personas',
		id: 40,
		actions: ['Servicio al cliente'],
		expected: ['Felicitaciones', 'solicitudes', 'sugerencias'],
	},
	{
		portal: 'personas',
		id: 41,
		actions: ['Mis créditos', 'Ir a mis créditos'],
		expected: ['Detalle de pago', 'extractos'],
	},
	{
		portal: 'empresas',
		id: 41,
		actions: ['Descarga', 'Certificado afiliación empresa'],
		expected: ['Continuar'],
	},
	{
		portal: 'empresas',
		id: 43,
		actions: ['Historial de solicitudes'],
		expected: ['Radicado', 'Fecha', 'Estado', 'Detalle'],
	},
	{
		portal: 'empresas',
		id: 44,
		actions: ['Gestión de procesos masivos'],
		expected: ['Código de proceso', 'Fecha', 'Estado', 'Detalle'],
	},
	{
		portal: 'empresas',
		id: 48,
		actions: [],
		expected: [
			'Afiliar trabajador',
			'Afiliación masiva',
			'Certificado afiliación',
		],
	},
	{
		portal: 'empresas',
		id: 49,
		actions: ['Servicio al cliente'],
		expected: ['Felicitaciones', 'solicitudes', 'sugerencias'],
	},
]

const portalFilter = process.env.COLSUBSIDIO_PORTAL as
	| ColsubsidioPortal
	| undefined

if (portalFilter && !['empresas', 'personas'].includes(portalFilter)) {
	throw new Error('COLSUBSIDIO_PORTAL must be empresas or personas')
}

const selectedChecks = portalFilter
	? checks.filter((check) => check.portal === portalFilter)
	: checks
const caseKey = ({ portal, id }: { portal: ColsubsidioPortal; id: number }) =>
	`${portal}-${id}`
const implementedKeys = checks.map(caseKey).sort()
const catalogKeys = colsubsidioCases
	.filter((testCase) => testCase.automation === 'partial-unverified')
	.map(caseKey)
	.sort()

assert.equal(new Set(implementedKeys).size, implementedKeys.length)
assert.deepEqual(implementedKeys, catalogKeys)

Feature('Colsubsidio - smoke autenticado parcial de solo lectura')

selectedChecks.forEach((check) => {
	const catalogCase = colsubsidioCases.find(
		(testCase) => caseKey(testCase) === caseKey(check)
	)
	assert.ok(catalogCase)

	const scenario =
		process.env.COLSUBSIDIO_RUN_AUTH === 'true' ? Scenario : Scenario.skip

	scenario(
		`[${check.portal.toUpperCase()}-${check.id}] ${catalogCase.title}`,
		async ({ colsubsidioPage }) => {
			await colsubsidioPage.login(check.portal)
			check.actions.forEach((action) =>
				colsubsidioPage.clickVisible(action)
			)
			colsubsidioPage.seeAll(check.expected)
		}
	)
})
