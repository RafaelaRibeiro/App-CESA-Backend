import { PatientRepository } from "../../repositories/PatientRepository";

export class GetPatientByRegUseCase {
  async execute(pac_reg: string) {
    if (!pac_reg) {
      throw new Error("Campo de busca inválido");
    }

    const patientRepository = new PatientRepository();

    const patient = await patientRepository.getPatientByReg(pac_reg);

    return patient;
  }
}
