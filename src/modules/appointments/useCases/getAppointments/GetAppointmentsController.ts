import { Request, Response } from "express";
import { GetAppointmentsUseCase } from "./GetAppointmentsUseCase";

export class GetAppointmentsController {
  async handle(request: Request, response: Response) {
    const { pac_reg } = request.params;

    const getAppointmentsUseCase = new GetAppointmentsUseCase();
    const result = await getAppointmentsUseCase.execute(pac_reg);

    return response.json(result);
  }
}
