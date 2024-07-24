// BONUS: (save in a separate .js file)
// 1. Write a mongo aggregation that returns all the projects that have a task with a due date set to “today”
// 2. Write a mongo aggregation that returns all the tasks that have a project with a due date set to “today”

import connectToDB from "./src/util/db.js";
const db = await connectToDB();
const taskCollection = db.collection('tasks');
const projectCollection = db.collection('projects');


const taskDueToday = async() => {

    // Convert dueDateStr to ISO date object
    const dueDate = new Date();

    // Ensure time is set to the end of the day
    const startOfDay = new Date(dueDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(dueDate.setHours(23, 59, 59, 999));

    // Create a query to filter by date
    const query = {
        dueDate: {
            $gte: startOfDay, // Start of the day
            $lte: endOfDay    // End of the day
        }
    };

    // Query the database
    const tasks = await taskCollection.find(query).toArray();
    console.log('Tasks : ', tasks.length);
    console.log(tasks);

    return tasks;
};

const projectsDueToday = async() => {
    
     // Convert dueDateStr to ISO date object
     const dueDate = new Date();


     // Ensure time is set to the end of the day
     const startOfDay = new Date(dueDate.setHours(0, 0, 0, 0));
     const endOfDay = new Date(dueDate.setHours(23, 59, 59, 999));
 
     // Create a query to filter by date
     const query = {
         dueDate: {
             $gte: startOfDay, // Start of the day
             $lte: endOfDay    // End of the day
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