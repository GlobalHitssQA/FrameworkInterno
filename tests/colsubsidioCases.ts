export type ColsubsidioPortal = 'empresas' | 'personas'

export type ColsubsidioCase = {
	portal: ColsubsidioPortal
	id: number
	title: string
	automation: 'partial-unverified' | 'blocked-prerequisites'
	nextAction: string
	level:
		| 'authenticated-read-only'
		| 'test-data-required'
		| 'external-system-required'
}

type ColsubsidioCaseInput = Omit<ColsubsidioCase, 'automation' | 'nextAction'>

const relations = ['hijo', 'hijastro', 'hermano', 'padres']
const civilTransitions = [
	'soltero a casado',
	'soltero a unión libre',
	'unión libre a casado',
	'unión libre a separado',
	'unión libre a viudo',
	'separado a unión libre',
	'separado a casado',
	'casado a viudo',
	'casado a separado',
	'viudo a casado',
	'viudo a unión libre',
]

const nextActionByLevel: Record<ColsubsidioCaseInput['level'], string> = {
	'authenticated-read-only':
		'Completar la aserción terminal y ejecutar con credenciales protegidas.',
	'test-data-required':
		'Definir fixture, resultado esperado y limpieza reversible antes de ejecutar.',
	'external-system-required':
		'Provisionar acceso al sistema externo, datos controlados y evidencia de integración.',
}

const expand = (
	portal: ColsubsidioPortal,
	start: number,
	values: string[],
	title: (value: string, index: number) => string,
	level: ColsubsidioCaseInput['level'] = 'test-data-required'
): ColsubsidioCaseInput[] =>
	values.map((value, index) => ({
		portal,
		id: start + index,
		title: title(value, index),
		level,
	}))

const companyCases: ColsubsidioCaseInput[] = [
	{
		portal: 'empresas',
		id: 1,
		title: 'Validar la afiliación de un titular (AFT)',
		level: 'test-data-required',
	},
	...expand(
		'empresas',
		2,
		['hijo', 'hermano', 'padres'],
		(relation) =>
			`Validar la afiliación de un titular con beneficiario ${relation} (AFT+BNF)`
	),
	...expand(
		'empresas',
		5,
		relations,
		(relation) =>
			`Validar la afiliación de beneficiario ${relation} con discapacidad (AFB)`
	),
	...expand(
		'empresas',
		9,
		relations,
		(relation) =>
			`Validar la afiliación de beneficiario ${relation} sin discapacidad (AFB)`
	),
	...expand(
		'empresas',
		13,
		relations,
		(relation) =>
			`Validar solicitud de novedad de discapacidad de beneficiario ${relation} (ND)`
	),
	...expand(
		'empresas',
		17,
		relations,
		(relation) =>
			`Validar solicitud de novedad de cuota monetaria de beneficiario ${relation} (NCM)`
	),
	{
		portal: 'empresas',
		id: 21,
		title: 'Validar el retiro de un titular (RIT)',
		level: 'test-data-required',
	},
	...expand(
		'empresas',
		22,
		relations,
		(relation) => `Validar el retiro de un beneficiario ${relation} (RIB)`
	),
	...expand(
		'empresas',
		26,
		civilTransitions,
		(transition) => `Validar el cambio de estado civil ${transition} (CEC)`
	),
	{
		portal: 'empresas',
		id: 37,
		title: 'Validar consulta de titular y beneficiarios de forma individual',
		level: 'test-data-required',
	},
	{
		portal: 'empresas',
		id: 38,
		title: 'Validar afiliación de titular y beneficiarios de forma masiva',
		level: 'test-data-required',
	},
	{
		portal: 'empresas',
		id: 39,
		title: 'Validar consulta de titular y beneficiarios de forma masiva',
		level: 'test-data-required',
	},
	{
		portal: 'empresas',
		id: 40,
		title: 'Validar retiros de titular y beneficiarios de forma masiva',
		level: 'test-data-required',
	},
	{
		portal: 'empresas',
		id: 41,
		title: 'Validar la descarga de certificación empresa',
		level: 'authenticated-read-only',
	},
	{
		portal: 'empresas',
		id: 42,
		title: 'Validar la descarga de certificación trabajador',
		level: 'test-data-required',
	},
	...expand(
		'empresas',
		43,
		[
			'Validar que se muestren los radicados en Historial de solicitudes',
			'Validar que se muestren los radicados en Gestión de procesos masivos',
		],
		(title) => title,
		'authenticated-read-only'
	),
	{
		portal: 'empresas',
		id: 45,
		title: 'Validar descarga de listado de trabajadores',
		level: 'test-data-required',
	},
	...expand(
		'empresas',
		46,
		[
			'Validación de solicitudes rechazadas',
			'Validación de solicitudes devueltas',
		],
		(title) => title,
		'external-system-required'
	),
	...expand(
		'empresas',
		48,
		[
			'Validación de links de accesos rápidos',
			'Validación de Servicio al cliente',
		],
		(title) => title,
		'authenticated-read-only'
	),
]

const personCases: ColsubsidioCaseInput[] = [
	...expand(
		'personas',
		1,
		relations,
		(relation) =>
			`Validar la afiliación de beneficiario ${relation} con discapacidad (AFB)`
	),
	...expand(
		'personas',
		5,
		relations,
		(relation) =>
			`Validar la afiliación de beneficiario ${relation} sin discapacidad (AFB)`
	),
	...expand(
		'personas',
		9,
		relations,
		(relation) =>
			`Validar solicitud de novedad de discapacidad de beneficiario ${relation} (ND)`
	),
	...expand(
		'personas',
		13,
		relations,
		(relation) =>
			`Validar solicitud de novedad de cuota monetaria de beneficiario ${relation} (NCM)`
	),
	...expand(
		'personas',
		17,
		relations,
		(relation) => `Validar el retiro de un beneficiario ${relation} (RIB)`
	),
	...expand(
		'personas',
		21,
		civilTransitions,
		(transition) => `Validar el cambio de estado civil ${transition} (CEC)`
	),
	...expand(
		'personas',
		32,
		[
			'Validar consulta de titular y beneficiarios de forma individual',
			'Validar la descarga de certificados de afiliación y subsidios',
			'Validar que se muestren los radicados en Historial de solicitudes',
		],
		(title) => title,
		'authenticated-read-only'
	),
	...expand(
		'personas',
		35,
		[
			'Validación de solicitudes rechazadas',
			'Validación de solicitudes devueltas',
		],
		(title) => title,
		'external-system-required'
	),
	...expand(
		'personas',
		37,
		[
			'Validación de links de accesos rápidos',
			'Validación de links de Productos',
			'Validación de links de Subsidios',
			'Validación de Servicio al cliente',
			'Validación de Mis créditos',
		],
		(title) => title,
		'authenticated-read-only'
	),
]

export const colsubsidioCases: ColsubsidioCase[] = [
	...companyCases,
	...personCases,
].map((testCase) => ({
	...testCase,
	automation:
		testCase.level === 'authenticated-read-only'
			? 'partial-unverified'
			: 'blocked-prerequisites',
	nextAction: nextActionByLevel[testCase.level],
}))
