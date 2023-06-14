import { Router } from "express";
import { CreateServiceOrderController } from "modules/serviceOrder/useCases/createServiceOrder/CreateServiceOrderController";

const osRouter = Router();

const createServiceOrderController = new CreateServiceOrderController();

osRouter.post("/:pac_reg", createServiceOrderController.handle);

export default osRouter;
