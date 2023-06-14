import { PatientRepository } from "../../repositories/PatientRepository";

export class UpdateFoneUseCase {
  async execute(pac_reg: string, fone: string) {
    if (!fone) throw new Error("Campo invalido");

    const patientRepository = new PatientRepository();
    const patient = await patientRepository.updateFone(pac_reg, fone);

    return patient;
  }
}
