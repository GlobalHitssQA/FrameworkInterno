const { I } = inject()

class DashboardPage {
	fields: {
		certificate: string
		activeTabDashboard: string
		searchButton: string
		searchButtonText: string
		viewPolicyButtonText: string
		viewPolicyButton: string
		surgeryButtonText: string
		reimbursementText: string
		termsCheckbox: string
		nextButtonText: string
	}

	constructor() {
		this.fields = {
			certificate: '//input[contains(@name,"hospitalSearch")]',
			activeTabDashboard: '//div[contains(@class,"tab active")]',
			searchButton:
				'//button[contains(@class,"primary-button button-text")]',
			searchButtonText: 'Search',
			viewPolicyButtonText: '//div[contains(@class,"dropdown-button")]',
			viewPolicyButton: '//div[contains(@class,"policy-button")]',
			surgeryButtonText: 'Planned Surgery',
			reimbursementText: 'Reimbursement',
			termsCheckbox: '#terms',
			nextButtonText: 'Next',
		}
	}

	searchCertificateCP(certificate: string) {
		I.waitForElement(this.fields.activeTabDashboard, 10)
		I.fillField(this.fields.certificate, certificate)
		I.click(this.fields.searchButton)
		I.waitForElement(this.fields.viewPolicyButton, 5)
		I.click(this.fields.viewPolicyButtonText)
		I.click(this.fields.surgeryButtonText)
		I.waitForElement(this.fields.termsCheckbox, 5)
		I.click(this.fields.termsCheckbox)
		I.click(this.fields.nextButtonText)
	}

	searchCertificateREE(certificate: string) {
		I.waitForElement(this.fields.activeTabDashboard, 10)
		I.fillField(this.fields.certificate, certificate)
		I.click(this.fields.searchButton)
		I.waitForElement(this.fields.viewPolicyButton, 5)
		I.click(this.fields.viewPolicyButtonText)
		I.click(this.fields.reimbursementText)
		I.waitForElement(this.fields.termsCheckbox, 5)
		I.click(this.fields.termsCheckbox)
		I.click(this.fields.nextButtonText)
	}
}

export = new DashboardPage()
