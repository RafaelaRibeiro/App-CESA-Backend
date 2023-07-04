import { ServiceOrderRepository } from "modules/serviceOrder/repositories/ServiceOrderRepository";

export class CreateServiceOrderUseCase {
  async execute(orders: any[]) {
    const serviceOrderRepository = new ServiceOrderRepository();

    // Criar uma única OSM
    const { orderService, smmItem } =
      await serviceOrderRepository.createServiceOrder(
        orders[0].pac_reg,
        orders[0].smmTpcod,
        orders[0].smmCod,
        orders[0].smmHonSeq,
        orders[0].smmMed,
        orders[0].osmCnv,
        orders[0].smmVlr,
        orders[0].smmTab,
        orders[0].smmNum,
        orders[0].agmHini
      );

    // Registrar os itens SMM
    const smmItems = [];
    for (let i = 1; i < orders.length; i++) {
      const smmItem = await serviceOrderRepository.createSMMItem(
        orderService.OSM_SERIE,
        orderService.OSM_NUM,
        orders[i].pac_reg,
        orders[i].smmTpcod,
        orders[i].smmCod,
        orders[i].smmHonSeq,
        orders[i].smmMed,
        orders[i].osmCnv,
        orders[i].smmVlr,
        orders[i].smmTab,
        orders[i].smmNum,
        orders[i].agmHini
      );
      smmItems.push(smmItem);
    }

    return { orderService, smmItems };
  }
}
