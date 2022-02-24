const mongoose = require('mongoose')
const members = require('./schemas')

const user = 'EmmanuelQAstaneda'
const password = 'tIBk8nRjpDaFYFQp'
const dataBaseName = 'Excavator'
let urlDataBase = `mongodb+srv://${user}:${password}@eliascluster.1ltm6.mongodb.net/${dataBaseName}?retryWrites=true&w=majority`

const conectDataBase = async (urlDataBase) => {
	await mongoose
		.connect(urlDataBase, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log('Mongo Data Base connected Succesfully'))
		.catch((e) => console.log(e))

	let response = await members.find()
	console.log(response)

	await mongoose
		.disconnect()
		.then(() => console.log('Disconnected from Mongo Data Base'))
		.catch((e) => console.log(e))
}

conectDataBase(urlDataBase)
//find(memberSchemaTemplate)
//disconectDataBase()
