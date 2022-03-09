import mongoose from 'mongoose'

/**
 * Conectar a la base de datos de Mongo.
 * * Escriba en la variable 'urlDataBase' la URL de conexión a la base de datos.
 */
export const connect = async (urlDataBase: string) => {
	await mongoose
		.connect(urlDataBase)
		.then(() => console.log('Mongo Data Base connected Succesfully'))
		.catch((e) => console.log(e))

}

/**
 * Encontrar uno o varios documentos de un determinado schema.
 * * Use un JSON en la variable 'dataToFind' para buscar un documento con data conocida.
 * * Escriba null en la variable 'dataToFind' para retornar todos los documentos que coincidan con el Schema.
 * * Escriba un array o un string dentro de 'keysToFind' los keys que desea retornar en la respuesta.
 * * Dejar en null para regresar todos los campos.
 */
export const find = async (schemaToUse: any, dataToFind: any, keysToFind?: string | string[] | null) => {

	return await schemaToUse.find(dataToFind, keysToFind)

}

/**
 * Encuentra un documento por Id de un determinado schema
 * * Escriba un array o un string dentro de 'keysToFind' los keys que desea retornar en la respuesta.
 * * Dejar en null para regresar todos los campos.
 */
export const findById = async (schemaToUse: any, id: string, keysToFind: string | string[] | null) => {

	return await schemaToUse.findById(id, keysToFind)

}

/**
 * Borrar un documento bucandolo por Id de un determinado schema
 */
export const deleteById = async (schemaToUse: any, id: string) => {

	return await schemaToUse.deleteOne({ _id: id })

}

/**
 * Borrar un documento bucandolo por data en un determinado schema
 */
export const deleteMany = async (schemaToUse: any, dataToFind: any) => {

	return await schemaToUse.deleteMany(dataToFind)

}

/**
 * Borrar un documento bucandolo por Id de un determinado schema
 */
export const deleteOne = async (schemaToUse: any, dataToFind: any) => {

	return await schemaToUse.deleteOne(dataToFind)

}
/**
 * update all the documents that match with the mock
 */

export const updateMany = async (schemaToUse: any, dataToFind: any, dataToReplace: any) => {

	return await schemaToUse.updateMany(dataToFind, dataToReplace)

}
/**
 * update the first document that match with the mock
 */

export const updateOne = async (schemaToUse: any, dataToFind: any, dataToReplace: any) => {

	return await schemaToUse.updateOne(dataToFind, dataToReplace)

}
/**
  * crea un nuevo documento de un determinado schema
  */

export const create = async (schemaToUse: any, dataToPut: any) => {

	const documentCreated = await schemaToUse.updateMany({ name: "noexist" }, dataToPut, { upsert: true })
	await schemaToUse.updateOne(dataToPut, { $unset: { __v: "" } })
	return documentCreated
}
/**
 * Desconecta la base de datos
 */
export const disconnect = async () => {

	await mongoose
		.disconnect()
		.then(() => console.log('Disconnected from Mongo Data Base'))
		.catch((e) => console.log(e))

}