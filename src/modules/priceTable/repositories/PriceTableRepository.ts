import { prisma } from "shared/infra/prisma/prisma";

interface IPriceTableRepository {
  getPriceTable(smm_tipo: string, smm_cod: string): Promise<any>;
}

class PriceTableRepository implements IPriceTableRepository {
  async getPriceTable(smm_tipo: string, smm_cod: string) {
    const priceTable = await prisma.pRE.findFirstOrThrow({
      where: {
        PRE_SMK_TIPO: smm_tipo,
        PRE_SMK_COD: smm_cod,
      },
    });

    return priceTable;
  }
}

export { PriceTableRepository };
