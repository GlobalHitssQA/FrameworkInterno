import { getData } from '../utils/excel'

Feature('Prueba AWP')

// Este scenario se correra una vez por cada fila que existe en el excel la primer fila de celdas se tomara como el nombre de la propiedad
Data(getData('./tests/data.xlsx')).Scenario(
	'Prueba AWP',
	async ({ I, current, loginPage, awpPage }) => {
		I.amOnPage('')
		await loginPage.fillTheFields(current.user, current.password)
		awpPage.testDashboardLinks()
		await awpPage.validatePerfilFields()
		awpPage.testDocumentsFilter()
	
	}
)
