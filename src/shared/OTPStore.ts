export class OTPStore {
  private static store = new Map<string, { otp: string; expires: Date }>();

  static setOTP(email: string, otp: string, expires: Date) {
    this.store.set(email, { otp, expires });
  }

  static verifyOTP(email: string, otp: string): boolean {
    const data = this.store.get(email);
    if (!data) return false;

    const now = Date.now();
    if (data.otp !== otp) return false;

    if (now > data.expires.getTime()) {
      this.clearOTP(email);
      return false;
    }

    return true;
  }

  static clearOTP(email: string) {
    this.store.delete(email);
  }
}
