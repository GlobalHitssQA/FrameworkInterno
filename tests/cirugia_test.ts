import { getData } from '../utils/excel'

Feature('Cirugía Programada Intake')

/* Scenario(
	'Cirugía Programada Intake',
	({ homePageML, dashboardPage, documentLoadPage, surgeryInfoPage }) => {
		homePageML.logIn('metlifecustomeruser', 'MetLifePilot@1234')
		dashboardPage.searchCertificate('0000003538245')
		documentLoadPage.uploadFiles()
		surgeryInfoPage.fillProgramInfo()
	}
) */

Data(getData('./tests/insumoIntake.xlsx')).Scenario(
	'Cirugía Programada con datos',
	async ({
		homePageML,
		dashboardPage,
		documentLoadPage,
		surgeryInfoPage,
		folioPage,
		current,
	}) => {
		homePageML.logIn(current.User, current.Password)
		dashboardPage.searchCertificate(current.Certificado)
		documentLoadPage.uploadFiles()
		surgeryInfoPage.fillProgramInfo(
			current.TypeOfClaim,
			current.Abroad,
			current.MetEmployee,
			current.IllnessDetails,
			current.Email,
			current.ContactNumber,
			current.Hospital,
			current.Doctor,
			current.Adicional
		)
		const folio = await folioPage.getFolio()
		folioPage.saveFolio(folio)
	}
)
