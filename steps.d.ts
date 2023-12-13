/* eslint-disable */
/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file.js')
type homePageML = typeof import('./pages/homePageML.js')
type loginPage = typeof import('./pages/loginPage')
type dashboardPage = typeof import('./pages/dashboardPage')
type documentLoadPage = typeof import('./pages/documentLoadPage')
type surgeryInfoPage = typeof import('./pages/surgeryInfoPage')
type folioPage = typeof import('./pages/folioPage')
type PlaywrightVideoAllure =
	typeof import('./utils/playwrightVideoAllure_helper')
type DbHelper = import('./node_modules/codeceptjs-dbhelper')
type ResembleHelper = import('codeceptjs-resemblehelper')
type ChaiWrapper = import('codeceptjs-chai')

declare namespace CodeceptJS {
	interface SupportObject {
		I: I
		current: any
		homePageML: homePageML
		loginPage: loginPage
		dashboardPage: dashboardPage
		documentLoadPage: documentLoadPage
		surgeryInfoPage: surgeryInfoPage
		folioPage: folioPage
	}
	interface Methods
		extends Playwright,
			PlaywrightVideoAllure,
			REST,
			GraphQL,
			DbHelper,
			ResembleHelper,
			ChaiWrapper {}
	interface I extends ReturnType<steps_file>, WithTranslation<Methods> {}
	namespace Translation {
		interface Actions {}
	}
}
