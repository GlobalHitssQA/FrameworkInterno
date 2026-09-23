/* eslint-disable codeceptjs/no-actor-in-scenario */
Feature('Colsubsidio - acceso público')
;(['empresas', 'personas'] as const).forEach((portal) => {
	Scenario(
		`El portal ${portal} presenta un formulario de acceso utilizable`,
		async ({ I, colsubsidioPage }) => {
			await colsubsidioPage.openLogin(portal)
			I.seeElement('[name="data.tpIdentificacion"]')
			I.seeElement('[name="data.numeroDocumento"]')
			I.seeElement('[name="password"]')
			I.seeElement('.gigya-input-submit')
		}
	)
})
