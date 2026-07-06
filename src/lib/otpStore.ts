// src/lib/otpStore.ts

// Stores OTPs in memory: email -> { otp, expires, purpose }
const otpStore = new Map<string, { otp: string; expires: number; purpose: string }>();

// Generate a random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP with 10-minute expiration
export function saveOTP(email: string, otp: string, purpose: string) {
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(email.toLowerCase(), { otp, expires, purpose });
}

// Verify OTP
export function verifyOTP(email: string, otp: string, purpose: string): { success: boolean; error?: string } {
  const emailKey = email.toLowerCase();
  const storedData = otpStore.get(emailKey);

  if (!storedData) {
    return { success: false, error: "No OTP requested for this email" };
  }

  if (storedData.purpose !== purpose) {
    return { success: false, error: "Invalid OTP purpose" };
  }

  if (Date.now() > storedData.expires) {
    otpStore.delete(emailKey);
    return { success: false, error: "OTP has expired. Please request a new one." };
  }

  if (storedData.otp !== otp) {
    return { success: false, error: "Incorrect OTP. Please try again." };
  }

  // Clear OTP on successful verification
  otpStore.delete(emailKey);
  return { success: true };
}
