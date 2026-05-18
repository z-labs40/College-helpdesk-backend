import { IUserRepository } from '../../interfaces/IUserRepository';
import { BadRequestError } from '../../../shared/error';
import { sendOldEmailNotification, sendNewEmailNotification } from '../../../infrastructure/emailService';
import { Logger } from '../../../shared/logger';

export class UpdateTechnicianUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    id: string, 
    data: { name?: string; email?: string; department?: string; phoneNumber?: string },
    adminInfo?: { id: string; email: string; name: string }
  ) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new BadRequestError('User not found');

    const oldEmail = user.email;
    const isEmailChanging = data.email && data.email !== oldEmail;

    if (isEmailChanging) {
      const existing = await this.userRepository.findByEmail(data.email!);
      if (existing) throw new BadRequestError('Email already in use');
    }

    await this.userRepository.update(id, data);

    if (isEmailChanging) {
      const newEmail = data.email!;
      
      // Write audit trail log immediately after database update is successful
      Logger.warn(
        `[AUDIT TRAIL] Admin ${
          adminInfo ? `(Name: ${adminInfo.name}, Email: ${adminInfo.email}, ID: ${adminInfo.id})` : 'system'
        } changed technician (Name: ${user.name}, ID: ${id}) email from "${oldEmail}" to "${newEmail}"`
      );

      // Dispatch notification emails to both addresses in parallel
      try {
        await Promise.all([
          sendOldEmailNotification(oldEmail, user.name, newEmail),
          sendNewEmailNotification(newEmail, user.name, oldEmail),
        ]);
      } catch (emailError) {
        Logger.error(
          `Failed to send email change notifications for technician ${id} (from ${oldEmail} to ${newEmail}): ${JSON.stringify(emailError)}`
        );
      }
    }

    return { ...user, ...data };
  }
}
