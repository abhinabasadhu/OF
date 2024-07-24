import connectToDB from "../util/db.js"
import Joi from 'joi';
import { ObjectId } from 'mongodb';

const db = await connectToDB();
const collection = db.collection('tasks');

// task schema 
const taskS = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().valid('todo', 'done').default('todo'),
  startDate: Joi.date().required(),
  doneDate: Joi.date().required(),
  dueDate: Joi.date().required(),
  projectId: Joi.string().default(''),
  timestamp: Joi.date().default(() => new Date())
});

export async function insertTask(item){
    // this function inserts the task into the db
    // params: task object

    // validation layer
    const { error, value } = taskS.validate(item);
    if (value) {
        // db operation
        const insertResult = await collection.insertOne(item);
        console.log('Inserted item:', insertResult.insertedId);
        // return result
        return insertResult;
    } else {
        throw new Error(error);
    }
}

export async function listAll() {
    // this function lists all the tasks

    const tasks = await collection.find({}).toArray(); // converting the cursor into a list of documents
    console.log(`All Tasks : ${tasks}`)
    return tasks;
}

export async function updateTask(query, item) {
    // this function updates an existing task
    // check if the task exists in the db
    const taskObjectid = new ObjectId(query.id);
    const task = await collection.findOne({'_id': taskObjectid})
    if (!task) {
        throw new Error('Task does not exits!');
    }
    const updateResult = await collection.updateOne({'id': id}, { $set: item });
    console.log('Updated task count:', updateResult.modifiedCount);
    return updateResult;
}

export async function deleteTask(id) {
    // this function will delete a single task
    // check if the task exists in the db

    const task = await collection.findOne({'id': id})
    if (!task) {
        throw new Error('Task does not exits!');
    }
    const deleteResult = await collection.deleteOne({'id': id});
    console.log('Deleted task count:', deleteResult.deletedCount);
    return deleteResult;
}

export async function filterTask() {}



