import connectToDB from "../util/db.js"
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { parseDateIso } from "../util/util.js";

const db = await connectToDB();
const collection = db.collection('projects');

// project schema 
const projectS = Joi.object({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    doneDate: Joi.date().required(),
    dueDate: Joi.date().required(),
    tasks: Joi.string().default([]),
    timestamp: Joi.date().default(() => new Date())
})

export async function insertProject(item) {
    // this function inserts the project into the db
    // params: project object

    // validation layer
    // parse the string dates into iso
    item.startDate = parseDateIso(item.startDate);
    item.dueDate = parseDateIso(item.dueDate);
    item.doneDate = parseDateIso(item.doneDate);
    
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

export async function listAllProjects() {
    // this function lists all the projects

    const projects = await collection.find({}).toArray(); // converting the cursor into a list of documents
    console.log(`All Projetcs : ${projects}`)
    return projects;
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
    // this function will fliter projects according to params
    const projects = await collection.find(query).toArray();
    return projects;
}

export async function asignTaskToProject(projectId, taskId) {

}