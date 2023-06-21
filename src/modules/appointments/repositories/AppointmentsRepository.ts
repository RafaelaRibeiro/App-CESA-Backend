import { prisma } from "shared/infra/prisma/prisma";
import { format, startOfDay, endOfDay } from "date-fns";

interface IAppointmentsRepository {
  getAppointments(pac_reg: string): Promise<any[]>;
}

export class AppointmentsRepository implements IAppointmentsRepository {
  async getAppointments(pac_reg: string) {
    const today = new Date();
    const startDate = startOfDay(today);
    const endDate = endOfDay(today);

    const appointments = await prisma.aGM.findMany({
      where: {
        AGM_PAC: Number(pac_reg),
        NOT: {
          AGM_STAT: "C",
        },
        AGM_HINI: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        AGM_PAC: true,
        AGM_HINI: true,
        AGM_HON_SEQ: true,
        AGM_CNV_COD: true,
        AGM_VALOR: true,
        CNV: {
          select: {
            CNV_TAB: true,
          },
        },

        PSV_AGM_AGM_MEDToPSV: {
          select: {
            PSV_COD: true,
            PSV_NOME: true,
          },
        },
        SMK: {
          select: {
            SMK_TIPO: true,
            SMK_COD: true,
            SMK_NOME: true,
          },
        },
        PAC: {
          select: {
            PAC_REG: true,
            PAC_NOME: true,
          },
        },
      },
    });
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
