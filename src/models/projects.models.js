import connectToDB from "../util/db.js"
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { parseDate } from "../util/util.js";

const db = await connectToDB();
const collection = db.collection('projects');
const taskCollection = db.collection('tasks');

// project schema 
const projectS = Joi.object({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    doneDate: Joi.date().required(),
    dueDate: Joi.date().required(),
    tasks: Joi.array().default([]),
    timestamp: Joi.date().default(() => new Date())
})

export async function insertProject(item) {
    // this function inserts the project into the db
    // params: project object

    // validation layer
    // parse the string dates into iso
    item.startDate = parseDate(item.startDate).toISOString();
    item.dueDate = parseDate(item.dueDate).toISOString();
    item.doneDate = parseDate(item.doneDate).toISOString();

    const { error, value } = projectS.validate(item, {
        abortEarly: true,
        allowUnknown: false
    });// prevents unknown fields to be added when validted


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


export async function updateProject(query, item) {
    // this function updates an existing projects
    // check if the pask exists in the db

    const projectObjectid = new ObjectId(query.id);
    const project = await collection.findOne({ '_id': projectObjectid })
    if (!project) {
        throw new Error('project does not exits!');
    }
    const updateResult = await collection.updateOne({ '_id': projectObjectid }, { $set: item });
    console.log('Updated project count:', updateResult.modifiedCount);
    return updateResult;
}

export async function deleteProject(query) {
    // this function will delete a single project
    // check if the project exists in the db

    const projectObjectid = new ObjectId(query.id);
    const project = await collection.findOne({ '_id': projectObjectid })
    if (!project) {
        throw new Error('project does not exits!');
    }
    const deleteResult = await collection.deleteOne({ '_id': projectObjectid });
    console.log('Deleted project count:', deleteResult.deletedCount);
    return deleteResult;
}

export async function filterProject(query) {
    // this function will fliter projects according to params or without params this function lists all the projects
    const projects = await collection.find(query).toArray();
    return projects;
}


export async function asignTaskToProject(projectId, taskId) {
    // this function will add tasks to projects

    // check if task exists
    const taskObjectid = new ObjectId(taskId)
    const task = await taskCollection.findOne({ '_id': taskObjectid })
    if (!task) {
        throw new Error('task does not exits!');
    }
    // check if project exists
    const projectObjectid = new ObjectId(projectId)
    const project = await collection.findOne({ '_id': projectObjectid })
    if (!project) {
        throw new Error('project does not exits!');
    }
    // check if task already exist in another project then pull it from there
    if (task.projectId) {
        if (new ObjectId(task.projectId).equals(project._id)) {
            // as it is already been assigned to the project
            return true;
        }
        // take the project from the array it already exists no need to update the projectid here as it will be done down the line anyway
        const updateproject = await collection.updateOne({ '_id': task.projectId }, { '$pull': { 'tasks': { '_id': taskObjectid } } })
        if (updateproject.modifiedCount !== 1) {
            return false
        }
    }
    // push task object to tasks array in project
    const update = await collection.updateOne({ '_id': projectObjectid }, { '$push': { 'tasks': task } })
    // update the projectId in tasks document
    const updatetask = await taskCollection.updateOne({ '_id': taskObjectid }, { $set: { projectId: projectObjectid } })
    if (update.modifiedCount === 1 && updatetask.modifiedCount === 1) {
        return true;
    };
}