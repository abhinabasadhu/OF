import { Router } from "express";
import { returnOk } from "../handlers/base.handlers.js";

const router = Router();

router.get("/", [returnOk]);

export default router;