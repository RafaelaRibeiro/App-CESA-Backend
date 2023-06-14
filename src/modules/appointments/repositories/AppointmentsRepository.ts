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
        AGM_HINI: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        AGM_PAC: true,
        AGM_HINI: true,
        PSV_AGM_AGM_MEDToPSV: {
          select: {
            PSV_NOME: true,
          },
        },
        SMK: {
          select: {
            SMK_NOME: true,
          },
        },
        PAC: {
          select: {
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
    return appointments;
  }
}
