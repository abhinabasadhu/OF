import { insertTask, listAll, updateTask, deleteTask, filterTask } from '../models/tasks.models.js';
import { parseDate } from '../util/util.js';

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
    try {
        // get all the possible filters from query
        const { startDate, doneDate, dueDate, status, name } = req.query;

        // create a empty query object and pass the filteres 
        const query = {};
        if (startDate) {
            // parse the date into non iso formate and then adjust it according to 1 second gap between greater than and less then 
            const parsedStartDate = parseDate(startDate);
            query.startDate = {
                $gte: new Date(parsedStartDate.toISOString().slice(0, 10) + "T00:00:00.000Z"),
                $lt: new Date(parsedStartDate.toISOString().slice(0, 10) + "T23:59:59.999Z")
            };
        }
        if (doneDate) {
            // parse the date into non iso formate and then adjust it according to 1 second gap between greater than and less then 
            const parsedDoneDate = parseDate(doneDate);
            query.doneDate = {
                $gte: new Date(parsedDoneDate.toISOString().slice(0, 10) + "T00:00:00.000Z"),
                $lt: new Date(parsedDoneDate.toISOString().slice(0, 10) + "T23:59:59.999Z")
              };
        }
        if (dueDate) {
            // parse the date into non iso formate and then adjust it according to 1 second gap between greater than and less then 
            const parsedDueDate = parseDate(dueDate);
            query.dueDate = {
                $gte: new Date(parsedDueDate.toISOString().slice(0, 10) + "T00:00:00.000Z"),
                $lt: new Date(parsedDueDate.toISOString().slice(0, 10) + "T23:59:59.999Z")
            }
        }
        if (status) {
            query.status = { $regex: `^${status}$`, $options: '' }; // Case-sensitive exact match
        }
        if (name) {
            query.name =  { $regex: `^${name}$`, $options: '' }; // Case-sensitive exact match
        }
        const tasks = await filterTask(query);
        if (tasks.length > 0) {
            res.status(200).json(tasks);
        } else {
            res.status(404).send('Tasks not found');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

