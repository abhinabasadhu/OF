import { insertTask, listAll, updateTask, deleteTask, filterTask } from '../models/tasks.models.js';

export async function createT(req, res) {
    // this handler will create task using the insertTask function in the task models
    // auth layer
    try {
        // get the task object from request body
        const newTask = req.body;
        // try inserting it into the db
        await insertTask(newTask);
        res.status(201).send('Task created successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export async function getT(req, res) {
    // this handler will list tasks using the listAll function in the task models
    // auth layer
    try {
        const tasks = await listAll();
        if (tasks) {
            res.status(200).json(tasks);
        } else {
            res.status(404).send('Tasks not found');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export async function editT(req, res) {
    // this handler will edit task using the updateTask function in the task models
    // auth layer
    try {
        const query = { id: req.params.id };
        const update = req.body;
        await updateTask(query, update);
        res.status(200).send('Task updated successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export async function deleteT(req, res) {
    // this handler will delete task using the deleteTask function in the task models
    // auth layer
    try {
        const query = { id: req.params.id };
        await deleteTask(query);
        res.status(200).send('Task deleted successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export async function filterT(req, res) {
    // this handler will filter task using the filterTask function in the task models
    // auth layer
}