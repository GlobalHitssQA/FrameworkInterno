const { I } = inject()
class AwpPage {
	fields: {
		clickTablero: string
		clickDocumentos:string
		clickPerfil: string
		buttonSap: string
		buttonDap: string
		buttonWorkFlow: string
		urlSap: string
		urlDap: string
		urlWorkFlow: string
		buttonMetaLife: string
		buttonMedicaLife: string
		buttonFlexiLife: string
		urlMetaLife: string
		urlMedicaLife: string
		urlFlexiLife: string
		listSeleccionarCategoria: string
		CategoriaProductos: string
		ProductoHorizonte: string
		FormatoPDF: string
		fieldRFC: string
		fieldCedulaA: string
		fieldVigenciaCedA: string
		fieldDireccion: string
		fieldEmail: string
		fieldCelular: string
		selectorInfoAgente: string
		selectorInfoPersona: string
	}
	constructor() {
		this.fields = {
			clickTablero: "//p[text()='Tablero']",
			clickDocumentos: "//p[text()='Documentos']",
			clickPerfil: "//p[text()='Perfil']",
			buttonSap: '#quicklinkCardquickLinks1',
			buttonDap: '#quicklinkCardquickLinks2',
			buttonWorkFlow: '#quicklinkCardquickLinks3',
			urlSap: 'https://1507.callidusondemand.com/SalesPortal/#!/',
			urlDap: 'https://metlifedap.niit-mts.com/en/',
			urlWorkFlow: 'https://www.cloud-asae.com.mx/MetLife/Default.aspx',
			buttonMetaLife:"//p[text()='MetaLife']",
			buttonMedicaLife: "//p[text()='MedicaLife Primordial']",
			buttonFlexiLife: "//p[text()='FlexiLife Inversión']",
			urlMetaLife:
				'https://qa.agentes.metlife.mx/app/products/seguros/metalife',
			urlMedicaLife: 'https://qa.agentes.metlife.mx/app/products/medico/medicalife-primordial',
			urlFlexiLife: 'https://qa.agentes.metlife.mx/app/products/seguros/flexilife-inversion',
			listSeleccionarCategoria: '//*[@id="root"]/div/div/div/div/div[2]/div[2]/div/div/div/div/div/div[1]/div/div/div[2]/div',
			CategoriaProductos: '//*[@id="menu-"]/div[3]/ul/li[2]/span[1]',
			ProductoHorizonte: "//p[text()='Horizonte']",
			FormatoPDF: "//p[text()='pdf']",
			fieldRFC: 'RFC',
			fieldCedulaA: 'CÉDULA DE AGENTE',
			fieldVigenciaCedA : 'VIGENCIA DE LA CÉDULA',
			fieldDireccion : 'DIRECCIÓN',
			fieldEmail: 'CORREO ELECTRÓNICO',
			fieldCelular: 'TELÉFONO CELULAR',
			selectorInfoAgente: "//p[text()='RFC']/..//p",
			selectorInfoPersona: "//p[text()='Dirección']/..//p"

		}
	}

	testDashboardLinks() {
		I.click(this.fields.clickTablero)
		I.click(this.fields.buttonSap)
		I.switchToNextTab()
		I.seeCurrentUrlEquals(this.fields.urlSap)
		I.closeCurrentTab()

		I.click(this.fields.buttonDap)
		I.switchToNextTab()
		I.seeCurrentUrlEquals(this.fields.urlDap)
		I.closeCurrentTab()

		I.click(this.fields.buttonWorkFlow)
		I.switchToNextTab()
		I.seeCurrentUrlEquals(this.fields.urlWorkFlow)
		I.closeCurrentTab()

		I.click(this.fields.buttonMetaLife)
		I.seeCurrentUrlEquals(this.fields.urlMetaLife)
		I.click(this.fields.clickTablero)

		I.click(this.fields.buttonMedicaLife)
		I.seeCurrentUrlEquals(this.fields.urlMedicaLife)
		I.click(this.fields.clickTablero)

		I.click(this.fields.buttonFlexiLife)
		I.seeCurrentUrlEquals(this.fields.urlFlexiLife)
		I.click(this.fields.clickTablero)
	}
	testDocumentsFilter() {
		I.click(this.fields.clickDocumentos)
		I.click(this.fields.listSeleccionarCategoria)
		I.click(this.fields.CategoriaProductos)
		I.click(this.fields.ProductoHorizonte)

		I.click(this.fields.FormatoPDF)
	}

	async validatePerfilFields() {
		I.click(this.fields.clickPerfil)
		const info = await I.grabTextFromAll(this.fields.selectorInfoAgente)
		I.assertContain(info, this.fields.fieldRFC)
		I.assertContain(info, this.fields.fieldCedulaA)
		I.assertContain(info, this.fields.fieldVigenciaCedA)

		const infoPer = await I.grabTextFromAll(this.fields.selectorInfoPersona)
		console.log(infoPer)
		I.assertContain(infoPer, this.fields.fieldDireccion)
		I.assertContain(infoPer, this.fields.fieldEmail)
		I.assertContain(infoPer, this.fields.fieldCelular)
	}
}
export = new AwpPage()
