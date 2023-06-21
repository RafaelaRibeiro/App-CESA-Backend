import { Request, Response } from "express";
import { CreateServiceOrderUseCase } from "./CreateServiceOrderUseCase";

export class CreateServiceOrderController {
  async handle(request: Request, response: Response) {
    const { pac_reg } = request.params;
    const { smmTpcod, smmCod, smmHonSeq, smmMed, osmCnv } = request.body;

    const createServiceOrderUseCase = new CreateServiceOrderUseCase();

    const result = await createServiceOrderUseCase.execute(
      pac_reg,
      smmTpcod,
      smmCod,
      smmHonSeq,
      smmMed,
      osmCnv
    );

    return response.json(result);
  }
}
