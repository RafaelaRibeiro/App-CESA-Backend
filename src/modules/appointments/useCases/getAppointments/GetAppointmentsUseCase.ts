import { AppointmentsRepository } from "modules/appointments/repositories/AppointmentsRepository";

export class GetAppointmentsUseCase {
  async execute(pac_reg: string) {
    const appointmentsRepository = new AppointmentsRepository();

    const appointments = await appointmentsRepository.getAppointments(pac_reg);

    return appointments;
  }
}
