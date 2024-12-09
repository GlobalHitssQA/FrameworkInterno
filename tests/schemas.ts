import { Schema, model} from 'mongoose';

const memberSchema = new Schema({
	name: String,
	lastName: String,
	nickName: String,
	instrument: String,
})

export const members = model('members', memberSchema)


