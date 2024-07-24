// BONUS: (save in a separate .js file)
// 1. Write a mongo aggregation that returns all the projects that have a task with a due date set to “today”
// 2. Write a mongo aggregation that returns all the tasks that have a project with a due date set to “today”

import connectToDB from "./src/util/db.js";
const db = await connectToDB();
const taskCollection = db.collection('tasks');
const projectCollection = db.collection('projects');


// Get today's date at midnight (00:00:00) in ISO format
const today = new Date();
today.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds
const isoToday = today.toISOString();

const taskDueToday = async() => {

    // Create a filter for tasks where the startDate is today
    const query = {
        dueDate: {
            $gte: isoToday // Greater than or equal to today
        }
    };

    // Query the database
    const tasks = await taskCollection.find(query).toArray();
    console.log('Tasks : ', tasks.length);
    console.log(tasks);

    return tasks;
};

const projectsDueToday = async() => {
    
    // Create a filter for tasks where the startDate is today
    const query = {
        dueDate: {
            $gte: isoToday // Greater than or equal to today
        }
    };

    // Query the database
    const projects = await projectCollection.find(query).toArray();
    console.log('Projects : ', projects.length);
    console.log(projects);

    return projects;
};


await taskDueToday();
await projectsDueToday();