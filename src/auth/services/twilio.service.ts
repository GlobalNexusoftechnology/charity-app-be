import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio.Twilio;
  private fromNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    this.client = Twilio(accountSid, authToken);
  }

  async sendOtp(phoneNumber: string, otp: string) {
    return this.client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: this.fromNumber,
      to: phoneNumber,
    });
  }
}
