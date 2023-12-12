Feature('Cirugía Programada Intake')

Scenario(
	'Cirugía Programada Intake',
	({ homePageML, dashboardPage, documentLoadPage, surgeryInfoPage }) => {
		homePageML.logIn('metlifecustomeruser', 'MetLifePilot@1234')
		dashboardPage.searchCertificate('0000003538245')
		documentLoadPage.uploadFiles()
		surgeryInfoPage.fillProgramInfo()
	}
)
