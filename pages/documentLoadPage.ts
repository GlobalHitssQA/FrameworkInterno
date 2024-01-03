const { I } = inject()

class DocumentLoadPage {
	fields: {
		idUploadBox: string
		gmmUploadBox: string
		summaryUploadBox: string
		labUploadBox: string
		invoicesUploadBox: string
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
			invoicesUploadBox:
				'//div/div/div/div/div[3]/div[5]/div[2]/div/div/div[2]/div[2]/input',
			nextButtonText: 'Next',
		}
	}

	uploadFilesCP() {
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
	}

	uploadFilesREE() {
		I.waitForElement(this.fields.idUploadBox, 5)
		I.attachFile(this.fields.idUploadBox, './documentos_ree/INE PDF.pdf')
		I.attachFile(
			this.fields.gmmUploadBox,
			'./documentos_ree/Solicitud de reclamacion.pdf'
		)
		I.attachFile(
			this.fields.summaryUploadBox,
			'./documentos_ree/Informe-medico. ALFONSO.pdf'
		)
		I.attachFile(
			this.fields.labUploadBox,
			'./documentos_ree/Estado de cuenta BBVA.pdf'
		)
		I.attachFile(this.fields.invoicesUploadBox, './documentos_ree/400.xml')
		// I.waitForEnabled(this.fields.nextButtonText, 20)
		I.wait(20)
		I.click(this.fields.nextButtonText)
	}
}

export = new DocumentLoadPage()
