import { prisma } from "shared/infra/prisma/prisma";

interface IAppointmentsRepository {
  getAppointments(pac_reg: string): Promise<any[]>;
}

export class AppointmentsRepository implements IAppointmentsRepository {
  async getAppointments(pac_reg: string) {
    const today = new Date();

    const appointments: any[] = await prisma.$queryRaw`
    SELECT AGM.AGM_PAC, AGM.AGM_TPSMK, AGM.AGM_SMK, AGM.AGM_MED, AGM.AGM_HINI, AGM.AGM_HON_SEQ, AGM.AGM_CNV_COD, AGM.AGM_VALOR,  PSV.PSV_NOME,  SMK.SMK_NOME,  PAC.PAC_NOME, CNV.CNV_TAB FROM AGM
INNER JOIN CNV ON AGM.AGM_CNV_COD = CNV.CNV_COD 
INNER JOIN PSV ON AGM.AGM_MED = PSV.PSV_COD
INNER JOIN SMK ON AGM.AGM_TPSMK = SMK.SMK_TIPO AND AGM.AGM_SMK = SMK.SMK_COD
INNER JOIN PAC ON AGM.AGM_PAC = PAC.PAC_REG
 WHERE  format(AGM.AGM_HINI , 'dd/MM/yyyy')  = FORMAT (GETDATE(),'dd/MM/yyyy') AND
 AGM.AGM_PAC= ${pac_reg}`;
    if (appointments.length === 0) {
      throw new Error(
        "Nenhum agendamento encontrado. Gentileza se dirigir à recepção"
      );
    }

    const appointmentsWithAutoIncrement = appointments.map(
      (appointment, index) => ({
        ...appointment,
        smmNum: index + 1,
      })
    );
    return appointmentsWithAutoIncrement;
  }
}
