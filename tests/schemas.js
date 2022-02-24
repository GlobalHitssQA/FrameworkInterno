const mongoose = require('mongoose')
const Schema = mongoose.Schema

const memberSchema = new Schema({
	name: String,
	lastName: String,
	nickName: String,
	instrument: String,
})

const members = mongoose.model('members', memberSchema)

module.exports = members
