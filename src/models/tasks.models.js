import connectToDB from "../util/db.js"
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { parseDate } from "../util/util.js";

const db = await connectToDB();
const collection = db.collection('tasks');
const projectCollection = db.collection('projects');

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

export async function insertTask(item) {
    // this function inserts the task into the db
    // params: task object

    // validation layer
    // parse the string dates into iso
    item.startDate = parseDate(item.startDate).toISOString();
    item.dueDate = parseDate(item.dueDate).toISOString();
    item.doneDate = parseDate(item.doneDate).toISOString();

    const { error, value } = taskS.validate(item, {
        abortEarly: true,
        allowUnknown: false
    });// prevents unknown fields to be added when validted;

    if (!error) {
        // db operation
        const insertResult = await collection.insertOne(value);
        console.log('Inserted item:', insertResult.insertedId);
        // return result
        return insertResult;
    } else {
        throw new Error(error);
    }
}


export async function updateTask(query, item) {
    // this function updates an existing task
    // check if the task exists in the db
    const taskObjectId = new ObjectId(query.id);
    const task = await collection.findOne({ '_id': taskObjectId })
    if (!task) {
        throw new Error('Task does not exits!');
    }
    if (item.status === 'todo' && task.status === 'done') {
        if (!item.startDate || !item.doneDate) {
            throw new Error('Task needs start and done dates for chaning the status from done to todo!');  
        }
    }
    const updateResult = await collection.updateOne({ '_id': taskObjectId }, { $set: item });
    console.log('Updated task count:', updateResult.modifiedCount);
    return updateResult;
}

export async function deleteTask(query) {
    // this function will delete a single task
    // check if the task exists in the db

    const taskObjectId = new ObjectId(query.id);
    const task = await collection.findOne({ '_id': taskObjectId })
    if (!task) {
        throw new Error('Task does not exits!');
    }
    if (task.projectId) {
        // if the task is assigned to a project unasign it to remove it 
        throw new Error('This task is added to a project, unasign the task first or remove it!');
    }
    const deleteResult = await collection.deleteOne({ '_id': taskObjectId });
    console.log('Deleted task count:', deleteResult.deletedCount);
    return deleteResult;
}

export async function filterTask(query) {
    // this function will fliter tasks according to params
    const tasks = await collection.find(query).toArray();
    return tasks;
}



