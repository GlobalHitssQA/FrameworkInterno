/* eslint-disable */
/// <reference types='codeceptjs' />
type steps_file = () => {
	grabDimensionsOfCurrentPage: () => Promise<{
		width: number
		height: number
		deviceScaleFactor: number
	}>
	checkIfCurrentDeviceIsTablet: () => Promise<{
		isDeviceTablet: boolean
		orientation: string
	}>
	fileExists(filePath: string): Promise<boolean>
	downloadFileFromSource({
		filePath,
		downloadPath,
		downloadPDFButton,
	}: {
		filePath: string
		downloadPath: string
		downloadPDFButton: string
	}): Promise<void>
	deleteFile(filePath: string): Promise<void>
	downloadFile({
		pdfPath,
		downloadPath,
		fileName,
		downloadPDFButton,
	}: {
		pdfPath: string
		downloadPath: string
		fileName: string
		downloadPDFButton: string
	})
	readPdf: (pdfUrl: string) => Promise<string>
}
type loginPage = typeof import('./pages/loginPage')
type PlaywrightVideoAllure =
	typeof import('./utils/playwrightVideoAllure_helper')
type DbHelper = import('./node_modules/codeceptjs-dbhelper')
type ResembleHelper = import('codeceptjs-resemblehelper')
type ChaiWrapper = import('codeceptjs-chai')
// aca se asocian los perfiles de la plataforma
type profileType = 'Banca Patrimonial' | 'Banca Privada' | 'Wealth Management'

declare namespace CodeceptJS {
	interface SupportObject {
		I: I
		current: any
		// aca se le pasan como parametros los perfiles de la plataforma
		login: (profile: profileType) => Promise<void>
		loginPage: loginPage
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
