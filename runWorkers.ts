import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import fs from 'fs'
import { EventEmitter } from 'events'
import kill from 'tree-kill'

class WorkerMonitor extends EventEmitter {
	private workers: Map<
		number,
		{
			startTime: number
			lastActivity: number
			status: 'idle' | 'running' | 'stuck' | 'completed'
			currentTask?: string
			process?: ChildProcess
			pid?: number
		}
	>

	private checkInterval: NodeJS.Timer

	constructor(private timeoutMs: number = 300000) {
		super()
		this.workers = new Map()
		this.startMonitoring()
	}

	registerWorker(workerId: number) {
		this.workers.set(workerId, {
			startTime: Date.now(),
			lastActivity: Date.now(),
			status: 'idle',
		})
	}

	updateWorkerStatus(
		workerId: number,
		status: 'idle' | 'running' | 'stuck' | 'completed',
		task?: string,
		process?: ChildProcess
	) {
		const worker = this.workers.get(workerId)
		if (worker) {
			worker.status = status
			worker.lastActivity = Date.now()
			if (task) {
				worker.currentTask = task
			}
			if (process) {
				worker.process = process
				worker.pid = process.pid
			}
		}
	}

	killWorkerProcess(workerId: number): Promise<void> {
		const worker = this.workers.get(workerId)
		if (worker && worker.pid) {
			return new Promise((resolve) => {
				if (worker.pid != null) {
					kill(worker.pid, 'SIGKILL', (err) => {
						if (err) {
							console.error(
								`Error al matar el proceso ${worker.pid}:`,
								err
							)
						}
						resolve()
					})
				}
			})
		}
		return Promise.resolve()
	}

	private startMonitoring() {
		this.checkInterval = setInterval(() => {
			const now = Date.now()
			this.workers.forEach((worker, workerId) => {
				if (
					worker.status === 'running' &&
					now - worker.lastActivity > this.timeoutMs
				) {
					// eslint-disable-next-line no-param-reassign
					worker.status = 'stuck'
					this.emit('worker-stuck', workerId, worker.currentTask)
				}
			})
		}, 60000) // Revisar cada minuto
	}

	getStuckWorkers() {
		return Array.from(this.workers.entries())
			.filter(([_, info]) => info.status === 'stuck')
			.map(([id, info]) => ({
				workerId: id,
				task: info.currentTask,
				stuckTime: Date.now() - info.lastActivity,
			}))
	}

	cleanup() {
		clearInterval(this.checkInterval)
	}
}

// Configuración
const totalWorkers = 5
const featuresDir = './features'
const monitor = new WorkerMonitor(600000) // 10 minutos de timeout

const featureFiles = fs
	.readdirSync(featuresDir)
	.filter((file) => file.endsWith('.feature'))

const taskQueue = featureFiles.map((file) => ({
	file: path.join(featuresDir, file),
	retries: 0,
}))

const activeWorkers = new Set()
const maxRetries = 2

// Contadores globales
const totalTasks = featureFiles.length
let completedTasks = 0
let failedTasks = 0

// Función para mostrar el progreso
function showProgress() {
	const pendingTasks = totalTasks - completedTasks - failedTasks
	console.log('\n=== Progreso de Pruebas ===')
	console.log(`Total de pruebas: ${totalTasks}`)
	console.log(`Completadas: ${completedTasks}`)
	console.log(`Fallidas: ${failedTasks}`)
	console.log(`Pendientes: ${pendingTasks}`)
	console.log('===========================\n')
}

// Función para verificar si todas las tareas están completas
function checkCompletion() {
	if (
		completedTasks + failedTasks === totalTasks &&
		activeWorkers.size === 0
	) {
		console.log('\n=== Resumen Final ===')
		console.log(`Total de pruebas ejecutadas: ${totalTasks}`)
		console.log(`Pruebas exitosas: ${completedTasks}`)
		console.log(`Pruebas fallidas: ${failedTasks}`)
		console.log('===================\n')
		console.log('Todas las tareas han sido completadas.')
		monitor.cleanup()
		process.exit(0)
	}
}

// Función para ejecutar un worker usando spawn
function runWorker(
	workerId: number,
	specificTask?: { file: string; retries: number }
): void {
	const task = specificTask || taskQueue.shift()

	if (!task) {
		if (taskQueue.length === 0 && activeWorkers.size === 0) {
			checkCompletion()
		}
		monitor.updateWorkerStatus(workerId, 'completed')
		return
	}

	const featureFile = task.file
	console.log(`Worker ${workerId} ejecutando: ${task.file}`)
	activeWorkers.add(workerId)

	const workerProcess = spawn(
		'npx',
		[
			'cross-env',
			`WORKER_ID=${workerId}`,
			'npx',
			'codeceptjs',
			'run',
			'--features',
			featureFile,
		],
		{
			shell: true,
			stdio: 'pipe',
		}
	)

	let output = ''
	monitor.updateWorkerStatus(workerId, 'running', task.file, workerProcess)

	workerProcess.stdout?.on('data', (data) => {
		output += data.toString()
		monitor.updateWorkerStatus(
			workerId,
			'running',
			task.file,
			workerProcess
		)
	})

	workerProcess.stderr?.on('data', (data) => {
		console.error(`Worker ${workerId} error:`, data.toString())
	})

	workerProcess.on('exit', (code) => {
		try {
			activeWorkers.delete(workerId)
			monitor.updateWorkerStatus(workerId, 'idle')

			const allScenariosExecuted =
				output.includes('Scenario:') && output.includes('Passed:')

			if (!allScenariosExecuted || code !== 0) {
				console.error(
					`Intento en Worker ${workerId} con ${task.file}: No se ejecutaron todos los escenarios exitosamente.`
				)
				if (task.retries < maxRetries) {
					task.retries += 1
					console.log(
						`Reintentando ${task.file} (intento ${task.retries} de ${maxRetries})`
					)
					taskQueue.push(task)
				} else {
					console.error(`Tarea fallida definitivamente: ${task.file}`)
					// eslint-disable-next-line no-plusplus
					failedTasks++
					showProgress()
					checkCompletion()
				}
			} else {
				console.log(
					`Worker ${workerId} completó ${task.file} correctamente.\n${output}`
				)
				// eslint-disable-next-line no-plusplus
				completedTasks++
				showProgress()
				checkCompletion()
			}
		} catch (err: any) {
			console.error(
				`Error inesperado en Worker ${workerId}:`,
				err.message
			)
			// eslint-disable-next-line no-plusplus
			failedTasks++
			showProgress()
			checkCompletion()
		} finally {
			runWorker(workerId)
		}
	})
}

// Función para reiniciar un worker stuck
async function restartStuckWorker(workerId: number, task: string) {
	console.log(`🔄 Worker ${workerId} stuck detectado en tarea: ${task}`)

	// Matar el proceso actual
	await monitor.killWorkerProcess(workerId)

	// Obtener el número actual de reintentos de la tarea
	const currentRetries = taskQueue.find((t) => t.file === task)?.retries || 0

	// Liberar el worker
	activeWorkers.delete(workerId)
	monitor.updateWorkerStatus(workerId, 'idle')

	if (currentRetries < maxRetries) {
		// Crear la tarea con el número correcto de reintentos
		const stuckTask = {
			file: task,
			retries: currentRetries + 1, // Incrementar el conteo actual
		}
		console.log(
			`🔄 Reintentando tarea stuck ${task} (intento ${stuckTask.retries} de ${maxRetries})`
		)
		runWorker(workerId, stuckTask)
	} else {
		console.log(
			`❌ La tarea ${task} excedió el número máximo de reintentos`
		)
		// eslint-disable-next-line no-plusplus
		failedTasks++
		showProgress()
		checkCompletion()
		runWorker(workerId)
	}
}

// Configurar el monitoreo de workers stuck con reinicio automático
monitor.on('worker-stuck', async (workerId: number, task: string) => {
	console.error(
		`⚠️ ALERTA: Worker ${workerId} está stuck en la tarea: ${task}`
	)
	await restartStuckWorker(workerId, task)
})

// Agregar un intervalo para reportar workers stuck
setInterval(() => {
	const stuckWorkers = monitor.getStuckWorkers()
	if (stuckWorkers.length > 0) {
		console.log('\n=== Workers Stuck ===')
		stuckWorkers.forEach(({ workerId, task, stuckTime }) => {
			console.log(
				`Worker ${workerId} - Tarea: ${task} - Tiempo stuck: ${Math.floor(
					stuckTime / 1000
				)}s`
			)
		})
	}
}, 60000) // Reportar cada minuto

// Mostrar progreso inicial
showProgress()

// Inicializar los workers con monitoreo
for (let i = 0; i < totalWorkers; i += 1) {
	monitor.registerWorker(i)
	runWorker(i)
}

// Manejar la terminación del proceso
process.on('SIGINT', () => {
	console.log('\nDeteniendo el proceso...')
	monitor.cleanup()
	process.exit(0)
})
