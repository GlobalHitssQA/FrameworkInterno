// in this file you can append custom step methods to 'I' object
import fs from 'fs'
import pdf from 'pdf-parse'
import { horizontal, tabletDescriptor } from './codecept.conf'

module.exports = function () {
	return actor({
		grabDimensionsOfCurrentPage() {
			return this.usePlaywrightTo(
				'grabDimensionsOfCurrentPage',
				async ({ page }) => {
					const dimensions = await page.evaluate(() => ({
						width: document.documentElement.clientWidth,
						height: document.documentElement.clientHeight,
						deviceScaleFactor: window.devicePixelRatio,
					}))
					return dimensions
				}
			)
		},
		async checkIfCurrentDeviceIsTablet() {
			const dimensiones = await this.grabDimensionsOfCurrentPage()

			const isDeviceTablet =
				(dimensiones.width === tabletDescriptor.viewport.width &&
					dimensiones.height === tabletDescriptor.viewport.height) ||
				(dimensiones.width === tabletDescriptor.viewport.height &&
					dimensiones.height === tabletDescriptor.viewport.width)

			const orientation = (() => {
				if (!isDeviceTablet) {
					return 'desktop'
				}
				if (
					dimensiones.width === horizontal.width &&
					dimensiones.height === horizontal.height
				) {
					return 'horizontal'
				}
				return 'vertical'
			})()

			return { isDeviceTablet, orientation }
		},

		async fileExists(filePath) {
			try {
				await fs.promises.access(filePath)
				return true
			} catch {
				return false
			}
		},

		async downloadFileFromSource({
			filePath,
			downloadPath,
			downloadPDFButton,
		}: {
			filePath: string
			downloadPath: string
			downloadPDFButton: string
		}) {
			this.handleDownloads(filePath)
			this.click(downloadPDFButton)
			this.amInPath(downloadPath)
			await this.waitForFile(filePath, 40)
		},

		async deleteFile(filePath) {
			try {
				const fd = await fs.promises.open(filePath, 'r')
				await fd.close()
				await fs.promises.unlink(filePath)
			} catch (error) {
				const message = `Failed to delete file at ${filePath}: ${error.message}`
				this.say(message)
				throw error
			}
		},

		async downloadFile({
			pdfPath,
			downloadPath,
			fileName,
			downloadPDFButton,
		}: {
			pdfPath: string
			downloadPath: string
			fileName: string
			downloadPDFButton: string
		}) {
			const downloadsPath = `${downloadPath}/${fileName}`
			const doesFileExist = await this.fileExists(pdfPath)
			if (doesFileExist) {
				await this.deleteFile(pdfPath)
			}
			await this.downloadFileFromSource({
				pdfPath: downloadsPath,
				downloadPath,
				downloadPDFButton,
			})
		},
		readPdf(PDFPath) {
			const dataBuffer = fs.readFileSync(PDFPath)
			return pdf(dataBuffer).then((data) => data.text)
		},
		// Define custom steps here, use 'this' to access default methods of I.
		// It is recommended to place a general 'login' function here.
	})
}
