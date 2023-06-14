import { Request, Response } from "express";
import { GetPatientByRegUseCase } from "./GetPatientByRegUseCase";

export class GetPatientByRegController {
  async handle(request: Request, response: Response) {
    const { pac_reg } = request.params;

    const getPatientByRegUseCase = new GetPatientByRegUseCase();
    const result = await getPatientByRegUseCase.execute(String(pac_reg || ""));

    return response.json(result);
  }
}
