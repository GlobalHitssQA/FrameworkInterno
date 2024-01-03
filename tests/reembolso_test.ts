import { getData } from '../utils/excel'

Feature('Reembolso Intake')

Data(getData('./tests/insumoIntake REE.xlsx')).Scenario(
	'Reembolso con datos',
	async ({
		homePageML,
		dashboardPage,
		documentLoadPage,
		folioPage,
		reimbursementInfoPage,
		dataPage,
		current,
	}) => {
		homePageML.logIn(current.User, current.Password)
		dashboardPage.searchCertificateREE(current.Certificado)
		documentLoadPage.uploadFilesREE()
		dataPage.fillDataFields()
		reimbursementInfoPage.fillReimbursementInfo(
			current.TypeOfClaim,
			current.TypeOfProcedure,
			current.Abroad,
			current.MetEmployee,
			current.TypeOfAdmission,
			current.Email,
			current.ContactNumber
		)
		const folio = await folioPage.getFolio()
		folioPage.saveFolio(folio)
	}
)
