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

    const serie = this.getSeriesNumber();
    const patient = await this.getPatientByReg(pac_reg);
    let cntOsmNew = await this.getNextOrderNumber(serie);

    const orderService = await this.createOrderService(
      serie,
      patient,
      cntOsmNew,
      now,
      osmCnv
    );

    await this.createServiceOrderItems(
      serie,
      cntOsmNew,
      patient,
      now,
      smmTpcod,
      smmCod,
      smmHonSeq,
      smmMed,
      smmVlr,
      smmTab,
      smmNum
    );

    await this.updateCNT(serie, cntOsmNew);

    return orderService;
  }

  private getSeriesNumber(): string {
    const currentYear = new Date().getFullYear() % 100;
    return `1${currentYear}`;
  }

  private async getPatientByReg(pac_reg: string) {
    const patientRepository = new PatientRepository();
    return await patientRepository.getPatientByReg(pac_reg);
  }

  private async getNextOrderNumber(serie: string): Promise<number> {
    const cntOsm = await prisma.cNT.findFirstOrThrow({
      where: { CNT_SERIE: Number(serie), CNT_TIPO: "OSM" },
    });

    return cntOsm?.CNT_NUM ?? 0 + 1;
  }

  private async createOrderService(
    serie: string,
    patient: any,
    cntOsmNew: number,
    now: Date,
    osmCnv: string
  ) {
    const OSM_STR = "106";
    const OSM_MREQ = 73597;
    const OSM_ATEND = "ASS";
    const OSM_CID_COD = "R51";
    const OSM_LEG_COD = "001";
    const OSM_CNPJ_SOLIC = "57596645000156";
    const OSM_PAC = patient?.PAC_REG ?? 0;
    const OSM_DTHR = now;
    const OSM_DT_RESULT = now;
    const OSM_DT_SOLIC = now;

    const osmData = {
      OSM_SERIE: Number(serie),
      OSM_PAC,
      OSM_NUM: cntOsmNew,
      OSM_DTHR,
      OSM_CNV: osmCnv,
      OSM_MREQ,
      OSM_PROC: "A",
      OSM_STR,
      OSM_IND_URG: "N",
      OSM_DT_RESULT,
      OSM_ATEND,
      OSM_CID_COD,
      OSM_DT_SOLIC,
      OSM_LEG_COD,
      OSM_USR_LOGIN_CAD: "ADM",
      OSM_TIPO_ACIDENTE: 2,
      OSM_TISS_TIPO_SAIDA: "5",
      OSM_TISS_TIPO_ATENDE: "05",
      OSM_MREQ_IND_SLINE: "S",
      OSM_CNPJ_SOLIC,
    };

    return prisma.oSM.create({ data: osmData });
  }

  private async updateCNT(serie: string, cntOsmNew: number) {
    await prisma.cNT.update({
      where: {
        CNT_TIPO_CNT_SERIE: { CNT_SERIE: Number(serie), CNT_TIPO: "OSM" },
      },
      data: {
        CNT_NUM: cntOsmNew,
      },
    });
  }

  private async createServiceOrderItems(
    serie: string,
    cntOsmNew: number,
    patient: any,
    now: Date,
    smmTpcod: string,
    smmCod: string,
    smmHonSeq: number,
    smmMed: number,
    smmVlr: number,
    smmTab: string,
    smmNum: number
  ) {
    const SMM_EXEC = "A";
    const SMM_SFAT = "A";
    const SMM_STR = "206";
    const SMM_ESP = "32";
    const SMM_TIPO_FATURA = "E";
    const SMM_USR_LOGIN_LANC = "ADM";
    const SMM_PAC_REG = patient?.PAC_REG ?? 0;
    await Promise.all([
      prisma.sMM.createMany({
        data: [
          {
            SMM_OSM_SERIE: Number(serie),
            SMM_OSM: cntOsmNew,
            SMM_PAC_REG,
            SMM_NUM: smmNum,
            SMM_TPCOD: smmTpcod,
            SMM_COD: smmCod,
            SMM_DTHR_EXEC: now,
            SMM_QT: 1,
            SMM_EXEC,
            SMM_SFAT,
            SMM_REP: "ADM",
            SMM_STR,
            SMM_MED: smmMed,
            SMM_VLCH: 0,
            SMM_VLR: smmVlr,
            SMM_HON_SEQ: smmHonSeq,
            SMM_HORA_ESP: "N",
            SMM_ESP,
            SMM_TIPO_FATURA,
            SMM_USR_LOGIN_LANC,
            SMM_DTHR_LANC: now,
            SMM_DTHR_ALTER: now,
            SMM_DT_RESULT: now,
            SMM_TAB_COD: smmTab,
            SMM_COD_AMOSTRA: `AN:${serie}.${cntOsmNew}-1`,
          },
        ],
      }),
      prisma.rCL.createMany({
        data: [
          {
            RCL_PAC: (patient?.PAC_REG ?? 0) + 1,
            RCL_TPCOD: smmTpcod,
            RCL_COD: smmCod,
            RCL_DTHR: now,
            RCL_OSM_SERIE: Number(serie),
            RCL_OSM: cntOsmNew,
            RCL_SMM: smmNum,
            RCL_MED: smmMed,
          },
        ],
      }),
    ]);
  }
}
