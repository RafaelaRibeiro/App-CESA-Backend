import { Request, Response } from "express";
import { CreateServiceOrderUseCase } from "./CreateServiceOrderUseCase";

export class CreateServiceOrderController {
  async handle(request: Request, response: Response) {
    const { pac_reg } = request.params;

    const createServiceOrderUseCase = new CreateServiceOrderUseCase();

    const result = await createServiceOrderUseCase.execute(pac_reg);

    return response.json(result);
  }
}
