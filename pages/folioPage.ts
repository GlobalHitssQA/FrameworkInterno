const { I } = inject()

class FolioPage {
	fields: {
		folioText: string
		submittedText: string
	}

	constructor() {
		this.fields = {
			folioText: '//p[contains(text(),"Receipt folio")]/b',
			submittedText: 'Planned Surgery Request Submitted',
		}
	}

	async getFolio() {
		I.waitForElement(this.fields.submittedText, 10)
		const folio = await I.grabTextFrom(this.fields.folioText)
		return folio
	}
}

export = new FolioPage()
