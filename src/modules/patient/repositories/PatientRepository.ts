import { prisma } from "shared/infra/prisma/prisma";
import { format, startOfDay, endOfDay } from "date-fns";

interface IPatientRepository {
  searchPatients(search: string): Promise<any[]>;
  updateFone(pac_reg: string, fone: string): Promise<any>;
}

class PatientRepository implements IPatientRepository {
  async searchPatients(search: string) {
    const today = new Date();
    const startDate = startOfDay(today);
    const endDate = endOfDay(today);
    const patients = await prisma.pAC.findMany({
      where: {
        OR: [{ PAC_NUMCPF: search }, { PAC_NOME: { contains: search } }],
        AGM: {
          some: {
            AGM_HINI: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      select: {
        PAC_REG: true,
        PAC_NOME: true,
        PAC_NASC: true,
        PAC_NOME_MAE: true,
      },

      orderBy: {
        PAC_NOME: "asc",
      },
    });

    if (patients.length === 0) {
      throw new Error(
        "Nenhum agendamento encontrado. Gentileza se dirigir à recepção"
      );
    }

    return patients;
  }

  async updateFone(pac_reg: string, fone: string) {
    const patient = await prisma.pAC.update({
      where: { PAC_REG: Number(pac_reg) },
      data: { PAC_CELULAR: fone },
    });

    return patient;
  }

  async getPatientByReg(pac_reg: string) {
    const patient = await prisma.pAC.findUnique({
      where: {
        PAC_REG: Number(pac_reg),
      },
      select: {
        PAC_NOME: true,
        PAC_REG: true,
      },
    });

    return patient;
  }
}

export { PatientRepository };
