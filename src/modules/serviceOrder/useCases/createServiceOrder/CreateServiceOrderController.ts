import { Request, Response } from "express";
import { CreateServiceOrderUseCase } from "./CreateServiceOrderUseCase";

export class CreateServiceOrderController {
  async handle(request: Request, response: Response) {
    const orders = request.body;

    const createServiceOrderUseCase = new CreateServiceOrderUseCase();

    const result = await createServiceOrderUseCase.execute(orders);

    return response.json(result);
  }
}
