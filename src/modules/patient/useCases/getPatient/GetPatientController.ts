import { Request, Response } from "express";
import { GetPatientUseCase } from "./GetPatientUseCase";

export class GetPatientController {
  async handle(request: Request, response: Response) {
    const { search } = request.query;

    const getPatientUseCase = new GetPatientUseCase();
    const result = await getPatientUseCase.execute(String(search || ""));

    return response.json(result);
  }
}
