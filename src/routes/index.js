import Router from "express-promise-router";

import taskHandler from "./tasks.routes.js";
// import projectHandler from "./projects.routes.js";
import baseHandler from "./base.routes.js";

const router = Router();

router.use("/", baseHandler);
router.use("/task", taskHandler);
// router.use("/project", projectHandler);

export default router;