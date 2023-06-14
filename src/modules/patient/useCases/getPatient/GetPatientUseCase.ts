import { PatientRepository } from "../../repositories/PatientRepository";

export class GetPatientUseCase {
  async execute(search: string) {
    if (!search) {
      throw new Error("Campo de busca inválido");
    }

    const patientRepository = new PatientRepository();

    const patient = await patientRepository.searchPatients(search);

    return patient;
  }
}
