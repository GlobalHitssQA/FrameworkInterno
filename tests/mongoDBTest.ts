import * as Mongo from '../utils/mongoDBUtils';
import { members } from './schemas';
import { mockFormongo } from './mocksForBackend';

const user = 'EmmanuelQAstaneda'
const password = 'tIBk8nRjpDaFYFQp'
const dataBaseName = 'Excavator'
let urlDataBase = `mongodb+srv://${user}:${password}@eliascluster.1ltm6.mongodb.net/${dataBaseName}?retryWrites=true&w=majority`

let id: string

Feature('Pruebas de bases de datos no relacionales')

BeforeSuite(async () => {
    // Connects to a database
    await Mongo.connect(urlDataBase);
})

AfterSuite(async () => {
    // Disconnects and removes the reference to the database
    await Mongo.disconnect();
})

Scenario('Testing Find query', async ({ I }) => {

    //Find All the documents, assert the length and save an id
    const response = await Mongo.find(members, null, null)

    I.assertEqual(response.length, 5)

    for (let i = 0; i < response.length; i++) {
        if (response[i].lastName === 'Moreno') {
            id = response[i]._id
            I.assertEqual(response[i].name, 'Fernando')
        }
    }

})

Scenario('Testing Create and Delete', async ({ I }) => {

    //Create a new document and then delete it
    let response = await Mongo.create(members, mockFormongo)

    I.assertEqual(response.acknowledged, true)
    console.log('Cree un nuevo documento')
    response = await Mongo.find(members, mockFormongo, null)
    console.log(response)

    //Borrar el documento creado
    response = await Mongo.deleteOne(members, mockFormongo)
    I.assertEqual(response.deletedCount,1)
    console.log(response)
})


