import { PatientRepository } from "modules/patient/repositories/PatientRepository";
import { prisma } from "shared/infra/prisma/prisma";

interface IServiceOrderRepository {
  createServiceOrder(
    pac_reg: string,
    smmTpcod: string,
    smmCod: string,
    smmHonSeq: number,
    smmMed: number,
    osmCnv: string,
    smmVlr: number,
    smmTab: string,
    smmNum: number
  ): Promise<any>;
}

export class ServiceOrderRepository implements IServiceOrderRepository {
  async createServiceOrder(
    pac_reg: string,
    smmTpcod: string,
    smmCod: string,
    smmHonSeq: number,
    smmMed: number,
    osmCnv: string,
    smmVlr: number,
    smmTab: string,
    smmNum: number
  ) {
    const now = new Date();
    now.setHours(now.getHours() - 3);

    const serie = "" + 1 + (Number(new Date().getFullYear()) % 100);
    const cntOsm = await prisma.cNT.findFirst({
      where: { CNT_SERIE: Number(serie), CNT_TIPO: "OSM" },
    });

    const cntOsmNew = cntOsm?.CNT_NUM ?? 0 + 1;

    const orderService = await prisma.oSM.create({
      data: {
        OSM_SERIE: Number(serie),
        OSM_PAC: Number(pac_reg),
        OSM_NUM: cntOsmNew,
        OSM_DTHR: now,
        OSM_CNV: osmCnv,
        OSM_MREQ: 73597,
        OSM_PROC: "A",
        OSM_STR: "106",
        OSM_IND_URG: "N",
        OSM_DT_RESULT: now,
        OSM_ATEND: "ASS",
        OSM_CID_COD: "ZOO",
        OSM_DT_SOLIC: now,
        OSM_LEG_COD: "001",
        OSM_USR_LOGIN_CAD: "ADM",
        OSM_TIPO_ACIDENTE: 2,
        OSM_TISS_TIPO_SAIDA: "5",
        OSM_TISS_TIPO_ATENDE: "05",
        OSM_MREQ_IND_SLINE: "S",
        OSM_CNPJ_SOLIC: "57596645000156",
      },
    });

    await prisma.cNT.update({
      where: {
        CNT_TIPO_CNT_SERIE: { CNT_SERIE: Number(serie), CNT_TIPO: "OSM" },
      },
      data: {
        CNT_NUM: cntOsmNew,
      },
    });

    await prisma.sMM.createMany({
      data: [
        {
          SMM_OSM_SERIE: Number(serie),
          SMM_OSM: cntOsmNew,
          SMM_PAC_REG: Number(pac_reg),
          SMM_NUM: smmNum,
          SMM_TPCOD: smmTpcod,
          SMM_COD: smmCod,
          SMM_DTHR_EXEC: now,
          SMM_QT: 1,
          SMM_EXEC: "A",
          SMM_SFAT: "A",
          SMM_REP: "ADM",
          SMM_STR: "206",
          SMM_MED: smmMed,
          SMM_VLCH: 0,
          SMM_VLR: smmVlr,
          SMM_HON_SEQ: smmHonSeq,
          SMM_HORA_ESP: "N",
          SMM_ESP: "32",
          SMM_TIPO_FATURA: "E",
          SMM_USR_LOGIN_LANC: "ADM",
          SMM_DTHR_LANC: now,
          SMM_DTHR_ALTER: now,
          SMM_DT_RESULT: now,
          SMM_TAB_COD: smmTab,
          SMM_COD_AMOSTRA: `AN:${serie}.${cntOsmNew}-1`,
        },
      ],
    });

    await prisma.rCL.createMany({
      data: [
        {
          RCL_PAC: Number(pac_reg),
          RCL_TPCOD: smmTpcod,
          RCL_COD: smmCod,
          RCL_DTHR: now,
          RCL_OSM_SERIE: Number(serie),
          RCL_OSM: cntOsmNew,
          RCL_SMM: smmNum,
          RCL_MED: smmMed,
        },
      ],
    });

    return orderService;
  }
}
