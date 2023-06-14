import { Router } from "express";
import { GetPatientByRegController } from "modules/patient/useCases/gePatientByReg/GetPatientByRegController";
import { GetPatientController } from "modules/patient/useCases/getPatient/GetPatientController";
import { UpdateFoneController } from "modules/patient/useCases/updateFone/UpdateFoneController";

const patientRouter = Router();

const getPatientController = new GetPatientController();
const getPatientByRegController = new GetPatientByRegController();
const updateFoneController = new UpdateFoneController();

patientRouter.get("/", getPatientController.handle);
patientRouter.get("/:pac_reg", getPatientByRegController.handle);

patientRouter.put("/:pac_reg/fone", updateFoneController.handle);

export default patientRouter;
