import { Request, Response } from "express";
import { UpdateFoneUseCase } from "./UpdateFoneUseCase";

export class UpdateFoneController {
  async handle(request: Request, response: Response) {
    const { pac_reg } = request.params;
    const { fone } = request.body;

    const updateFoneUseCaseFoneUseCase = new UpdateFoneUseCase();

    const result = await updateFoneUseCaseFoneUseCase.execute(pac_reg, fone);

    return response.json(result);
  }
}
