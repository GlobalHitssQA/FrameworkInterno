/* eslint-disable class-methods-use-this */
const { I } = inject()

type ColsubsidioPortal = 'empresas' | 'personas'

const portalUrls: Record<ColsubsidioPortal, string> = {
	empresas:
		'https://transacciones.colsubsidio.com/portalempresas/ciam/qa/#/login',
	personas:
		'https://transacciones.colsubsidio.com/portalpersonas/ciam/qa/#/login',
}

const envPrefix: Record<ColsubsidioPortal, string> = {
	empresas: 'COLSUBSIDIO_EMPRESAS',
	personas: 'COLSUBSIDIO_PERSONAS',
}

class ColsubsidioPage {
	async openLogin(portal: ColsubsidioPortal) {
		I.amOnPage(portalUrls[portal])
		I.waitForText('Iniciar Sesión', 30)
		I.click('Iniciar Sesión')
		I.waitForElement('[name="data.numeroDocumento"]', 30)
		I.waitForElement('[name="password"]', 30)
	}

	async login(portal: ColsubsidioPortal) {
		const prefix = envPrefix[portal]
		const document = process.env[`${prefix}_DOCUMENT`]
		const password = process.env[`${prefix}_PASSWORD`]

		if (!document || !password) {
			throw new Error(`Missing ${prefix}_DOCUMENT or ${prefix}_PASSWORD`)
		}

		await this.openLogin(portal)
		I.fillField('[name="data.numeroDocumento"]', secret(document))
		I.fillField('[name="password"]', secret(password))
		I.click('.gigya-input-submit')
		I.waitForInvisible('[name="password"]', 60)
		I.waitForText('Servicio al cliente', 60)
	}

	clickVisible(label: string) {
		const locator = {
			xpath: `//*[self::a or self::button or @role="button"][contains(normalize-space(.), ${JSON.stringify(
				label
			)})]`,
		}
		I.waitForElement(locator, 30)
		I.click(locator)
	}

	seeAll(labels: string[]) {
		labels.forEach((label) => I.waitForText(label, 30))
	}
}

export = new ColsubsidioPage()
