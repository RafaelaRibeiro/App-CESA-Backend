import { prisma } from "shared/infra/prisma/prisma";

export class ServiceOrderRepository {
  async createServiceOrder(
    pac_reg: number,
    smmTpcod: string,
    smmCod: string,
    smmHonSeq: number,
    smmMed: number,
    osmCnv: string,
    smmVlr: string,
    smmTab: string,
    smmNum: number,
    agmHini: Date
  ) {
    const now = new Date();
    now.setHours(now.getHours() - 3);

    const serie = "" + 1 + (Number(new Date().getFullYear()) % 100);
    const cntOsm = await prisma.cNT.findFirst({
      where: { CNT_SERIE: Number(serie), CNT_TIPO: "OSM" },
    });
    let osNum = cntOsm?.CNT_NUM ? cntOsm.CNT_NUM : 0;
    const cntOsmNew = osNum + 1;

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
        OSM_CID_COD: "Z000",
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

    const smmItem = await this.createSMMItem(
      Number(serie),
      cntOsmNew,
      pac_reg,
      smmTpcod,
      smmCod,
      smmHonSeq,
      smmMed,
      osmCnv,
      smmVlr,
      smmTab,
      smmNum,
      agmHini
    );

    return { orderService, smmItem };
  }

  async createSMMItem(
    osmSerie: number,
    osmNum: number,
    pac_reg: number,
    smmTpcod: string,
    smmCod: string,
    smmHonSeq: number,
    smmMed: number,
    osmCnv: string,
    smmVlr: string,
    smmTab: string,
    smmNum: number,
    agmHini: Date
  ) {
    const now = new Date();
    now.setHours(now.getHours() - 3);

    const smmItem = await prisma.sMM.create({
      data: {
        SMM_OSM_SERIE: osmSerie,
        SMM_OSM: osmNum,
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
        SMM_VLR: parseFloat(smmVlr),
        SMM_HON_SEQ: smmHonSeq,
        SMM_HORA_ESP: "N",
        SMM_ESP: "32",
        SMM_TIPO_FATURA: "E",
        SMM_USR_LOGIN_LANC: "ADM",
        SMM_DTHR_LANC: now,
        SMM_DTHR_ALTER: now,
        SMM_DT_RESULT: now,
        SMM_TAB_COD: smmTab,
        SMM_COD_AMOSTRA: `AN:${osmSerie}.${osmNum}-${smmNum}`,
        FLE: {
          create: {
            FLE_DTHR_CHEGADA: now,
            FLE_PSV_COD: smmMed,
            FLE_STR_COD: "106",
            FLE_PAC_REG: Number(pac_reg),
            FLE_ORDEM: 1,
            FLE_STATUS: "A",
            FLE_DTHR_MARCADA: agmHini,
            FLE_USR_LOGIN: "ADM",
            FLE_OBS: "AUTO ATENDIMENTO",
            FLE_PSV_RESP: smmMed,
            FLE_DTHR_REG: now,
            FLE_PROCED: "OS",
          },
        },
        RCL: {
          create: {
            RCL_PAC: Number(pac_reg),
            RCL_TPCOD: smmTpcod,
            RCL_COD: smmCod,
            RCL_DTHR: now,
            RCL_MED: smmMed,
            RCL_STAT: "A",
          },
        },
      },
    });

    return smmItem;
  }
}
