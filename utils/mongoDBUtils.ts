import mongoose from 'mongoose'

/**
 * Conectar a la base de datos de Mongo.
 * * Escriba en la variable 'urlDataBase' la URL de conexión a la base de datos.
 */
export const connect = async (urlDataBase: string) => {
	try {
		await mongoose
			.connect(urlDataBase)
			.then(() => console.log('Mongo Data Base connected Succesfully'))
			.catch((e) => console.log(e))
	} catch (e) {
		console.log(e)
	}

}

/**
 * Encontrar uno o varios documentos de un determinado schema.
 * * Use un JSON en la variable 'dataToFind' para buscar un documento con data conocida.
 * * Escriba null en la variable 'dataToFind' para retornar todos los documentos que coincidan con el Schema.
 * * Escriba un array o un string dentro de 'keysToFind' los keys que desea retornar en la respuesta.
 * * Dejar en null para regresar todos los campos.
 */
export const find = async (schemaToUse: any, dataToFind: any, keysToFind?: string | string[] | null) => {
	try {
		return await schemaToUse.find(dataToFind, keysToFind)
	}
	catch (e) {
		console.log(e)
		return e
	}

}

/**
 * Encuentra un documento por Id de un determinado schema
 * * Escriba un array o un string dentro de 'keysToFind' los keys que desea retornar en la respuesta.
 * * Dejar en null para regresar todos los campos.
 */
export const findById = async (schemaToUse: any, id: string, keysToFind: string | string[] | null) => {
	try {
		return await schemaToUse.findById(id, keysToFind)
	} catch (e) {
		console.log(e)
		return e
	}

}

/**
 * Borrar un documento bucandolo por Id de un determinado schema
 */
export const deleteById = async (schemaToUse: any, id: string) => {

	try {
		return await schemaToUse.deleteOne({ _id: id })
	} catch (e) {
		console.log(e)
		return e
	}

}

/**
 * Borrar un documento bucandolo por data en un determinado schema
 */
export const deleteMany = async (schemaToUse: any, dataToFind: any) => {

	try {
		return await schemaToUse.deleteMany(dataToFind)
	} catch (e) {
		console.log(e)
		return e
	}

}

/**
 * Borrar un documento bucandolo por Id de un determinado schema
 */
export const deleteOne = async (schemaToUse: any, dataToFind: any) => {

	try {
		return await schemaToUse.deleteOne(dataToFind)
	} catch (e) {
		console.log(e)
		return e
	}
}
/**
 * update all the documents that match with the mock
 */

export const updateMany = async (schemaToUse: any, dataToFind: any, dataToReplace: any) => {

	try {
		return await schemaToUse.updateMany(dataToFind, dataToReplace)
	} catch (e) {
		console.log(e)
		return e
	}
}
/**
 * update the first document that match with the mock
 */

export const updateOne = async (schemaToUse: any, dataToFind: any, dataToReplace: any) => {

	try {
		return await schemaToUse.updateOne(dataToFind, dataToReplace)
	} catch (e) {
		console.log(e)
		return e
	}
}
/**
  * crea un nuevo documento de un determinado schema
  */

export const create = async (schemaToUse: any, dataToPut: any) => {

	try {
		const documentCreated = await schemaToUse.updateMany({ name: "noexist" }, dataToPut, { upsert: true })
		await schemaToUse.updateOne(dataToPut, { $unset: { __v: "" } })
		return documentCreated
	} catch (e) {
		console.log(e)
		return e
	}
}
/**
 * Desconecta la base de datos
 */
export const disconnect = async () => {


	try {
		await mongoose
			.disconnect()
			.then(() => console.log('Disconnected from Mongo Data Base'))
			.catch((e) => console.log(e))
	} catch (e) {
		console.log(e)
		return e
	}
}