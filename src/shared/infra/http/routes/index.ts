import { Router } from "express";
import patientRouter from "./patient.routes";
import osRouter from "./serviceOrder.routes";
import appointmentsRouter from "./appointments.routes";

const router = Router();

router.use("/patients", patientRouter);
router.use("/serviceOrder", osRouter);
router.use("/appointments", appointmentsRouter);

export { router };
