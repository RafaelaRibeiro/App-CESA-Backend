import { ServiceOrderRepository } from "modules/serviceOrder/repositories/ServiceOrderRepository";

export class CreateServiceOrderUseCase {
  async execute(
    pac_reg: string,
    smmTpcod: string,
    smmCod: string,
    smmHonSeq: number,
    smmMed: number,
    osmCnv: string
  ) {
    const serviceOrderRepository = new ServiceOrderRepository();
    const serviceOrder = await serviceOrderRepository.createServiceOrder(
      pac_reg,
      smmTpcod,
      smmCod,
      smmHonSeq,
      smmMed,
      osmCnv
    );

    return serviceOrder;
  }
}
