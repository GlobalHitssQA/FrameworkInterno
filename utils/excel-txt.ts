import fs from 'fs'
import XLSX from 'xlsx'

export const getData = (route, separator, position, linesSplit) => {
	let rows
	// Determinar la extensión del archivo
	const fileExtension = route.split('.').pop().toLowerCase()
	if (fileExtension === 'txt') {
		const txtContent = fs.readFileSync(route, 'utf8')
		const lines = txtContent.split(linesSplit)
		rows = lines
			.map((line) => {
				const columns = line.split(separator)
				return [columns[position]] // El índice 6 corresponde a la columna COD_CUENTA
			})
			.filter((row) => row[0] !== '') // Filtrar líneas donde COD_CUENTA esté vacío
	} else {
		const workbook = XLSX.readFile(route)
		rows = XLSX.utils.sheet_to_json(workbook.Sheets.Hoja1, {
			header: 1,
			raw: false,
		})
	}

	const data = new DataTable(rows[0])
	rows.shift()
	rows.forEach((row) => {
		if (row.length) {
			data.add(row)
		}
	})

	return data
}
