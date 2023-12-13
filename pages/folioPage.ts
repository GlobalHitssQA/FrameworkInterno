import XLSX from 'xlsx'

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

	// eslint-disable-next-line class-methods-use-this
	saveFolio(folio: string) {
		const workbook = XLSX.utils.book_new()
		const worksheet = XLSX.utils.aoa_to_sheet([['Folio'], [folio]])
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1 ')
		XLSX.writeFile(workbook, `Report-${Date.now()}.xlsx`)
	}
}

export = new FolioPage()
