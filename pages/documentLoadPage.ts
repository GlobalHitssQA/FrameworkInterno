const { I } = inject()

class DocumentLoadPage {
	fields: {
		idUploadBox: string
		gmmUploadBox: string
		summaryUploadBox: string
		labUploadBox: string
		nextButtonText: string
	}

	constructor() {
		this.fields = {
			idUploadBox:
				'//div/div/div/div/div[3]/div[1]/div[2]/div/div/div[2]/div[2]/input',
			gmmUploadBox:
				'//div/div/div/div/div[3]/div[2]/div[2]/div/div/div[2]/div[2]/input',
			summaryUploadBox:
				'//div/div/div/div/div[3]/div[3]/div[2]/div/div/div[2]/div[2]/input',
			labUploadBox:
				'//div/div/div/div/div[3]/div[4]/div[2]/div/div/div[2]/div[2]/input',
			nextButtonText: 'Next',
		}
	}

	uploadFiles() {
		I.waitForElement(this.fields.idUploadBox, 5)
		I.attachFile(this.fields.idUploadBox, './documentos_cp/ine.png')
		I.attachFile(
			this.fields.gmmUploadBox,
			'./documentos_cp/solicitud-reembolso-gastos-medicos-mayores. GUADALUPE.pdf'
		)
		I.attachFile(
			this.fields.summaryUploadBox,
			'./documentos_cp/resumen.pdf'
		)
		I.attachFile(this.fields.labUploadBox, './documentos_cp/lab.jpg')
		I.click(this.fields.nextButtonText)
		I.wait(10)
	}
}

export = new DocumentLoadPage()
