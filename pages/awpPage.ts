const { I } = inject()
class awpPage {
	fields: {
		clickTablero: string
		clickDocumentos:string
		clickPerfil: string
		clickSap: string
		clickDap: string
		clickWorkFlow: string
		linkSap: string
		linkDap: string
		linkWorkFlow: string
		clickMetaLife: string
		clickMedicaLife: string
		clickFlexiLife
		dirMetaLife: string
		dirMedicaLife: string
		dirFlexiLife: string
		clickSeleccionarCategoria: string
		clickCategoriaProductos: string
		clickProductoHorizonte: string
		clickFormatoPDF: string
	}
	constructor() {
		this.fields = {
			clickTablero: "//p[text()='Tablero']",
			clickDocumentos: "//p[text()='Documentos']",
			clickPerfil: '//*[@id="profileID"]/div[2]/p[2]',
			clickSap: '#quicklinkCardquickLinks1',
			clickDap: '#quicklinkCardquickLinks2',
			clickWorkFlow: '#quicklinkCardquickLinks3',
			linkSap: 'https://1507.callidusondemand.com/SalesPortal/#!/',
			linkDap: 'https://metlifedap.niit-mts.com/en/',
			linkWorkFlow: 'https://www.cloud-asae.com.mx/MetLife/Default.aspx',
			clickMetaLife:"//p[text()='MetaLife']",
			clickMedicaLife: "//p[text()='MedicaLife Primordial']",
			clickFlexiLife: "//p[text()='FlexiLife Inversión']",
			dirMetaLife:
				'https://qa.agentes.metlife.mx/app/products/seguros/metalife',
			dirMedicaLife: 'https://qa.agentes.metlife.mx/app/products/medico/medicalife-primordial',
			dirFlexiLife: 'https://qa.agentes.metlife.mx/app/products/seguros/flexilife-inversion',
			clickSeleccionarCategoria: '//*[@id="root"]/div/div/div/div/div[2]/div[2]/div/div/div/div/div/div[1]/div/div/div[2]/div/div/div',
			clickCategoriaProductos: '//*[@id="menu-"]/div[3]/ul/li[2]',
			clickProductoHorizonte: "//p[text()='Horizonte']",
			clickFormatoPDF: "//p[text()='pdf']"

		}
	}

	async testDashboard() {
		I.click(this.fields.clickTablero)
		I.click(this.fields.clickSap)
		I.switchToNextTab()
		I.seeCurrentUrlEquals(this.fields.linkSap)
		I.closeCurrentTab()

		I.click(this.fields.clickDap)
		I.switchToNextTab()
		I.seeCurrentUrlEquals(this.fields.linkDap)
		I.closeCurrentTab()

		I.click(this.fields.clickWorkFlow)
		I.switchToNextTab()
		I.seeCurrentUrlEquals(this.fields.linkWorkFlow)
		I.closeCurrentTab()

		I.click(this.fields.clickMetaLife)
		I.seeCurrentUrlEquals(this.fields.dirMetaLife)
		I.click(this.fields.clickTablero)

		I.click(this.fields.clickMedicaLife)
		I.seeCurrentUrlEquals(this.fields.dirMedicaLife)
		I.click(this.fields.clickTablero)

		I.click(this.fields.clickFlexiLife)
		I.seeCurrentUrlEquals(this.fields.dirFlexiLife)
		I.click(this.fields.clickTablero)
	}
	async testDocuments() {
		I.click(this.fields.clickDocumentos)
		I.click(this.fields.clickSeleccionarCategoria)
		I.click(this.fields.clickCategoriaProductos)
		I.click(this.fields.clickProductoHorizonte)

		I.click(this.fields.clickFormatoPDF)
	}

	async testPerfil() {
		I.click(this.fields.clickPerfil)
		const info = await I.grabTextFromAll("//p[text()='RFC']/..//p")
		I.assertContain(info, 'RFC')
		I.assertContain(info, 'CÉDULA DE AGENTE')
		I.assertContain(info, 'VIGENCIA DE LA CÉDULA')

		const infoPer = await I.grabTextFromAll("//p[text()='Dirección']/..//p")
		console.log(infoPer)
		I.assertContain(infoPer, 'DIRECCIÓN')
		I.assertContain(infoPer, 'CORREO ELECTRÓNICO')
		I.assertContain(infoPer, 'TELÉFONO CELULAR')

		//I.assertLengthOf(infoPer, 11) console.log(infoPer)
	}
}
export = new awpPage()
