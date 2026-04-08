/* eslint-disable no-console */
/**
 * Runner para los escenarios de performance con k6.
 *
 * Este script se invoca desde los npm scripts (k6:smoke, k6:load, etc.) y
 * se encarga de:
 *   1. Detectar si k6 está instalado localmente; si no, caer a Docker.
 *   2. Crear el directorio de salida para los reportes.
 *   3. Invocar el binario de k6 con los flags adecuados y propagar el exit code.
 *
 * Ejemplo de uso directo:
 *   npx ts-node performance/runK6.ts smoke
 *   npx ts-node performance/runK6.ts load --env=staging
 *   npx ts-node performance/runK6.ts scenarios/rickAndMortyApi.js
 */

import { spawnSync, SpawnSyncReturns } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

type ScenarioMap = Record<string, string>

const SCENARIOS: ScenarioMap = {
	smoke: 'performance/scenarios/smoke.js',
	load: 'performance/scenarios/load.js',
	stress: 'performance/scenarios/stress.js',
	spike: 'performance/scenarios/spike.js',
	soak: 'performance/scenarios/soak.js',
	api: 'performance/scenarios/rickAndMortyApi.js',
}

const OUTPUT_DIR = path.resolve(process.cwd(), 'output', 'k6')

function ensureOutputDir(): void {
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true })
	}
}

function resolveScript(arg: string): string {
	if (SCENARIOS[arg]) {
		return SCENARIOS[arg]
	}
	// Permite pasar una ruta explícita al script
	if (fs.existsSync(arg)) {
		return arg
	}
	throw new Error(
		`Escenario k6 desconocido: "${arg}". Opciones: ${Object.keys(
			SCENARIOS
		).join(', ')} o una ruta a un archivo .js`
	)
}

function hasK6Installed(): boolean {
	const probe = spawnSync('k6', ['version'], { stdio: 'ignore' })
	return probe.status === 0
}

function hasDockerInstalled(): boolean {
	const probe = spawnSync('docker', ['--version'], { stdio: 'ignore' })
	return probe.status === 0
}

interface CliArgs {
	scenario: string
	k6Args: string[]
	env: string
}

function parseArgs(argv: string[]): CliArgs {
	const rest = argv.slice(2)
	if (rest.length === 0) {
		throw new Error(
			'Debe indicar un escenario. Ejemplo: npx ts-node performance/runK6.ts smoke'
		)
	}

	let scenario = ''
	let env = process.env.K6_ENV || 'dev'
	const k6Args: string[] = []

	rest.forEach((arg) => {
		if (arg.startsWith('--env=')) {
			env = arg.split('=')[1]
			return
		}
		if (arg.startsWith('--')) {
			k6Args.push(arg)
			return
		}
		if (!scenario) {
			scenario = arg
			return
		}
		k6Args.push(arg)
	})

	if (!scenario) {
		throw new Error('No se encontró el nombre del escenario en los argumentos.')
	}

	return { scenario, k6Args, env }
}

function runWithLocalK6(scriptPath: string, env: string, extra: string[]): number {
	const summaryJson = path.join(OUTPUT_DIR, `${path.basename(scriptPath, '.js')}.json`)
	const args = [
		'run',
		'-e',
		`K6_ENV=${env}`,
		'--summary-export',
		summaryJson,
		...extra,
		scriptPath,
	]
	console.log(`[k6] ejecutando: k6 ${args.join(' ')}`)
	const result: SpawnSyncReturns<Buffer> = spawnSync('k6', args, {
		stdio: 'inherit',
	})
	return result.status ?? 1
}

function runWithDocker(scriptPath: string, env: string, extra: string[]): number {
	const summaryJson = `/output/k6/${path.basename(scriptPath, '.js')}.json`
	const args = [
		'run',
		'--rm',
		'-i',
		'-v',
		`${process.cwd()}:/work`,
		'-w',
		'/work',
		'grafana/k6:latest',
		'run',
		'-e',
		`K6_ENV=${env}`,
		'--summary-export',
		summaryJson,
		...extra,
		scriptPath,
	]
	console.log(`[k6] ejecutando vía docker: docker ${args.join(' ')}`)
	const result: SpawnSyncReturns<Buffer> = spawnSync('docker', args, {
		stdio: 'inherit',
	})
	return result.status ?? 1
}

function main(): void {
	let parsed: CliArgs
	try {
		parsed = parseArgs(process.argv)
	} catch (err) {
		console.error((err as Error).message)
		process.exit(2)
		return
	}

	const scriptPath = resolveScript(parsed.scenario)
	ensureOutputDir()

	let exitCode: number
	if (hasK6Installed()) {
		exitCode = runWithLocalK6(scriptPath, parsed.env, parsed.k6Args)
	} else if (hasDockerInstalled()) {
		console.warn(
			'[k6] no se encontró el binario de k6, se ejecutará a través de Docker (grafana/k6:latest).'
		)
		exitCode = runWithDocker(scriptPath, parsed.env, parsed.k6Args)
	} else {
		console.error(
			'[k6] no se encontró ni el binario `k6` ni `docker`. Instale k6 (https://k6.io/docs/getting-started/installation/) o Docker antes de ejecutar las pruebas de performance.'
		)
		process.exit(127)
		return
	}

	process.exit(exitCode)
}

main()
