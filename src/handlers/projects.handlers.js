import { insertProject, updateProject, deleteProject, filterProject, asignTaskToProject } from '../models/projects.models.js';
import { parseDate } from '../util/util.js';

export async function createP(req, res) {
    // this handler will create project using the insertproject function in the project models
    // auth layer
    try {
        // get the project object from request body
        const newproject = req.body;
        // try inserting it into the db
        await insertProject(newproject);
        res.status(201).send('project created successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export async function editP(req, res) {
    // this handler will edit project using the updateproject function in the project models
    // auth layer
    try {
        const query = { id: req.params.id };
        const update = req.body;
        await updateProject(query, update);
        res.status(200).send('project updated successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export async function deleteP(req, res) {
    // this handler will delete project using the deleteproject function in the project models
    // auth layer
    try {
        const query = { id: req.params.id };
        await deleteProject(query);
        res.status(200).send('project deleted successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export async function getP(req, res) {
    // this handler will filter project using the filterproject function in the project models and 
    // when no filter params is given this will return everything
    // auth layer

    try {
        // get all the possible filters from query
        const { startDate, doneDate, dueDate, name } = req.query;

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
        if (name) {
            query.name =  { $regex: `^${name}$`, $options: '' }; // Case-sensitive exact match
        }

        const projects = await filterProject(query);
        if (projects.length > 0) {
            res.status(200).json(projects);
        } else {
            res.status(404).send('projects not found');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export  async function asignTtoP(req, res) {
    //asignTaskToProject
    // auth layer
    try {
        const { projectId, taskId} = req.query;
        await asignTaskToProject(projectId, taskId);
        res.status(200).send('project updated successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}