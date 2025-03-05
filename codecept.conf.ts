import { createOpenAI } from '@ai-sdk/openai'
import { createMistral } from '@ai-sdk/mistral'
import { generateText } from 'ai'
import './heal'

require('ts-node/register')
// Esto se debe de descomentar si se va a usar el la propiedad de emulate en la configuracion
// const { devices } = require('playwright')

// Validate required environment variables
if (!process.env.MISTRAL_API_KEY) {
	console.warn(
		'Warning: MISTRAL_API_KEY environment variable is not set. Mistral AI features will not work.'
	)
}
if (!process.env.OPENAI_API_KEY) {
	console.warn(
		'Warning: OPENAI_API_KEY environment variable is not set. OpenAI features will not work.'
	)
}

const mistral = createMistral({
	apiKey: process.env.MISTRAL_API_KEY,
})

const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

const mistralModel = mistral('mistral-large-latest')
const openaiModel = openai('o3-mini')

// vista vertical de tablet
export const vertical = {
	height: 1334,
	width: 1000,
}
// vista horizontal de tablet
export const horizontal = {
	height: 1000,
	width: 1334,
}
// vista tablet de ser ncesario
export const tabletDescriptor = {
	// en viewport se cambia la vista de tablet horizontal o vertical
	viewport: horizontal,
	userAgent:
		'Mozilla/5.0 (Linux; Android 10; SM-P610) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Safari/537.36',
	deviceScaleFactor: 1,
	isMobile: true,
	hasTouch: true,
	defaultBrowserType: 'chromium',
}
// metodo para hacer uso del as cookies
function createLogin(userType: profileType) {
	// se asocian las cuentas y sus contraseñas
	const users = {
		'Banca Patrimonial': {
			email: process.env.BANCA_PATRIMONIAL_EMAIL,
			password: process.env.BANCA_PATRIMONIAL_PASSWORD,
		},
		'Banca Privada': {
			email: process.env.BANCA_PRIVADA_EMAIL,
			password: process.env.BANCA_PRIVADA_PASSWORD,
		},
		'Wealth Management': {
			email: process.env.WEALTH_MANAGEMENT_EMAIL,
			password: process.env.WEALTH_MANAGEMENT_PASSWORD,
		},
	}

	const { email, password } = users[userType]

	return {
		login: async (I) => {
			try {
				// aca va todo el proceso para que se haga el login por primera vez y guardar las cookies
				I.amOnPage('/auth/login')
				I.waitForElement('button:has-text("Ingresar")', 60)
				I.click('button:has-text("Ingresar")')
				I.waitForElement('input[type="email"]', 60)
				I.fillField('input[type="email"]', email)
				I.click('text=Siguiente')
				I.wait(1) // Espera para que no marque error en la contraseña
				I.fillField('input[type="password"]', password)
				I.click('text=Iniciar sesión')

				// Validar si la sesión requiere confirmación si es tablet, se manejan las vistas de tablet si es que se ocupan
				const dimensiones = await I.grabDimensionsOfCurrentPage()
				const isTablet =
					(dimensiones.width === tabletDescriptor.viewport.width &&
						dimensiones.height ===
							tabletDescriptor.viewport.height) ||
					(dimensiones.width === tabletDescriptor.viewport.height &&
						dimensiones.height === tabletDescriptor.viewport.width)

				if (!isTablet) {
					I.click('text=Sí') // Confirmar "Sí" si no está en tablet
				}

				I.waitForElement('span:has-text("Avances y logros")', 60)
			} catch (error) {
				console.error('Login failed:', error)
				throw new Error(
					`Login failed for user ${email}: ${error.message}`
				)
			}
		},
		check: (I) => {
			// Aca se validan pasos extras para entrar en el login y usar los cookies
			I.amOnPage('/')
			I.click('button:has-text("Ingresar")')
			I.waitForElement('span:has-text("Avances y logros")', 60)
		},
	}
}

exports.config = {
	output: './output',
	helpers: {
		Playwright: {
			url: 'http://zero.webappsecurity.com/login.html',
			// Ejemplo de emular un dispositvo pero por defecto en todas las pruebas si quiere solo probarse solo en una prueba vease el test de emulacionDeDispositivos
			// emulate: tabletDescriptor,
			show: false,
			browser: 'chromium',
			waitForNavigation: 'domcontentloaded',
			video: true,
			keepVideoForPassedTests: true,
			pressKeyDelay: 100,
			trace: true,
			keepTraceForPassedTests: true,
		},
		PlaywrightVideoAllure: {
			require: './utils/playwrightVideoAllure_helper',
		},
		REST: {
			endpoint: 'https://rickandmortyapi.com/api/character/',
		},
		GraphQL: {
			endpoint: 'https://rickandmortyapi.com/graphql',
		},
		DbHelper: {
			require: './node_modules/codeceptjs-dbhelper',
		},
		// TODO: Revisar o actualizar la librería.

		// ResembleHelper: {
		//	require: 'codeceptjs-resemblehelper',
		//	baseFolder: './tests/screenshots/base/',
		//	diffFolder: './tests/screenshots/diff/',
		// },

		ChaiWrapper: {
			require: 'codeceptjs-chai',
		},
	},
	include: {
		I: './steps_file.ts',
		loginPage: './pages/loginPage',
	},
	mocha: {},
	bootstrap: null,
	teardown: null,
	hooks: [],
	gherkin: {
		features: './features/*.feature',
		steps: ['./step_definitions/RegistroSteps'],
	},
	plugins: {
		subtitles: {
			enabled: true,
		},
		screenshotOnFail: {
			enabled: true,
		},
		pauseOnFail: {},
		retryFailedStep: {
			require: './plugins/retryFailedSteps',
			enabled: true,
		},
		tryTo: {
			enabled: true,
		},
		allure: {
			enabled: true,
			require: 'allure-codeceptjs',
			outputDir: `./output/allure-results-worker-${
				process.env.WORKER_ID || 'default'
			}`,
		},

		// Se habilita el plugin, se le inyecta con login y se manda a llamar el metodo createLogin para el perfil del usuario
		// este perfil se cambia dependiendo de los perfiles de la plataforma
		autoLogin: {
			enabled: false, // habilitar al ocupar
			saveToFile: false, // habilitar al ocupar
			inject: 'login',
			users: {
				'Banca Patrimonial': createLogin('Banca Patrimonial'),
			},
		},
		selenoid: {
			enabled: false,
			deletePassed: false,
			autoCreate: true,
			autoStart: true,
			sessionTimeout: '30m',
			enableVideo: true,
			enableLog: true,
		},
		fakerTransform: {
			enabled: true,
		},
		heal: {
			enabled: true,
		},
	},
	tests: './tests/*_test.ts',
	name: 'Framework',
	ai: {
		request: async (messages) => {
			try {
				const model =
					process.env.MODEL === 'mistral' ? mistralModel : openaiModel
				const formattedPrompt = messages
					.map((m) => `${m.role || 'user'}: ${m.content}`)
					.join('\n\n')
				const { text } = await generateText({
					model,
					prompt: formattedPrompt,
				})
				return text
			} catch (error) {
				console.error('AI generation error:', error)
				return `AI generation failed: ${
					error.message || 'Unknown error'
				}`
			}
		},
	},
}
