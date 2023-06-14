import { Router } from "express";
import { GetAppointmentsController } from "modules/appointments/useCases/getAppointments/GetAppointmentsController";

const appointmentsRouter = Router();

const getAppointmentsController = new GetAppointmentsController();

appointmentsRouter.get("/:pac_reg", getAppointmentsController.handle);

export default appointmentsRouter;
