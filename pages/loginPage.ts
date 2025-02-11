import path from 'path'

const { I } = inject()

class LoginPage {
	fields: {
		username: string
		password: string
		buttonText: string
		textInLoginPage: string
		pdfPath: string
		fileName: string
		folderDownloads: string
		downloadPDFButton: string
	}

	constructor() {
		this.fields = {
			username: '#user_login',
			password: '#user_password',
			buttonText: 'Sign in',
			textInLoginPage: 'Log in to ZeroBank',
			pdfPath: path.resolve(
				__dirname,
				'..',
				'output',
				'output',
				'Planfinanciero_.pdf'
			),
			fileName: 'Nombre del PDF a descargar (ejem: Planfinanciero_.pdf)',
			folderDownloads:
				'Nombre de la carpeta destino del pdf (ejem: output)',
			downloadPDFButton:
				'aca va el identificador elemento que dispara la accion de descarga del pdf',
		}
	}

	async fillTheFields(username: string, password: string) {
		const amNotILoggedIn = await globalThis.tryTo(() =>
			I.see(this.fields.textInLoginPage)
		)
		if (amNotILoggedIn) {
			I.fillField(this.fields.username, username)
			I.fillField(this.fields.password, password)
			I.click(this.fields.buttonText)
		}
	}

	async downloadPDF() {
		await I.downloadFile({
			pdfPath: this.fields.pdfPath,
			downloadPath: this.fields.folderDownloads,
			fileName: this.fields.fileName,
			downloadPDFButton: this.fields.downloadPDFButton,
		})
	}

	async validatePDF() {
		// Se descarga el contenido del pdf con el metodo readPDF para ser validado
		const pdfContent = await I.readPdf(this.fields.pdfPath)

		const expectedContent = ['expected text', 'another expected text']
		expectedContent.forEach((text) => {
			if (!pdfContent.includes(text)) {
				throw new Error(
					`PDF validation failed: Expected text "${text}" not found`
				)
			}
		})
	}
}

export = new LoginPage()
