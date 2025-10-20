import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Donations } from './entity/donation.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './entity/subscriptions.entity';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Donations)
    private donationRepository: Repository<Donations>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(
    amount: number,
    donor_name: string,
    donor_contact: string,
    donation_type: string,
    donation_for: string,
    frequency: 'One-Time' | 'Recurring',
    user_id?: string,
    donor_email?: string,
  ) {
    try {
      const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
      };

      const order = await this.razorpay.orders.create(options);

      const donation = this.donationRepository.create({
        donor_name,
        donor_contact,
        amount,
        currency: 'INR',
        razorpay_order_id: order.id,
        donation_type,
        donation_for,
        frequency,
        user_id,
        donor_email,
      });

      await this.donationRepository.save(donation);

      return {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: this.configService.get('RAZORPAY_KEY_ID'),
      };
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async verifyPayment(
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string,
  ) {
    try {
      const sign = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac('sha256', this.configService.get('RAZORPAY_KEY_SECRET'))
        .update(sign.toString())
        .digest('hex');

      if (razorpay_signature === expectedSign) {
        await this.donationRepository.update(
          { razorpay_order_id },
          {
            razorpay_payment_id,
            razorpay_signature,
          },
        );

        return { status: 'success', message: 'Payment verified successfully' };
      } else {
        return { status: 'failed', message: 'Payment verification failed' };
      }
    } catch (error) {
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }

  async getDonations() {
    return await this.donationRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async createCustomPlan(
    amount: number,
    period: string,
    interval: number,
  ): Promise<string> {
    const allowedPeriods = ['weekly', 'monthly', 'yearly'];
    const normalizedPeriod = period.trim().toLowerCase();

    if (!allowedPeriods.includes(normalizedPeriod)) {
      throw new BadRequestException(
        `Invalid subscription period "${period}". Allowed are ${allowedPeriods.join(', ')}`,
      );
    }

    const plan = await this.razorpay.plans.create({
      period: normalizedPeriod as 'weekly' | 'monthly' | 'yearly',
      interval: interval,
      item: {
        name: `Plan every ${interval} ${normalizedPeriod}${interval > 1 ? 's' : ''}`,
        amount: amount * 100,
        currency: 'INR',
        description: 'User created subscription plan',
      },
    });

    return plan.id;
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const { amount, period, interval } = createSubscriptionDto;

    const planId = await this.createCustomPlan(amount, period, interval);

    const subscription = await this.razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12,
      quantity: 1,
    });

    return subscription;
  }

  async verifyAndSaveSubscription(
    razorpay_payment_id: string,
    razorpay_subscription_id: string,
    razorpay_signature: string,
    user_id: string,
    amount: number,
    period: string,
    interval: number,
    donor_name?: string,
    donor_contact?: string,
    donation_type?: string,
    donation_for?: string,
  ) {
    const sign = razorpay_payment_id + '|' + razorpay_subscription_id;
    const expectedSign = crypto
      .createHmac('sha256', this.configService.get('RAZORPAY_KEY_SECRET'))
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      throw new BadRequestException('Payment verification failed');
    }

    const subscription = await this.razorpay.subscriptions.fetch(
      razorpay_subscription_id,
    );

    const newSub = this.subscriptionRepository.create({
      user_id,
      razorpay_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_start * 1000),
      current_period_end: new Date(subscription.current_end * 1000),
      next_billing_date: new Date(subscription.current_end * 1000),
      plan_period: period as 'weekly' | 'monthly' | 'yearly',
      plan_interval: interval,
      amount,
    });

    await this.subscriptionRepository.save(newSub);

    const donation = this.donationRepository.create({
      donor_name: donor_name || 'Guest',
      donor_contact: donor_contact || '0000000000',
      amount,
      currency: 'INR',
      razorpay_payment_id,
      razorpay_order_id: razorpay_subscription_id,
      razorpay_signature,
      donation_type: donation_type || 'Subscription',
      donation_for: donation_for || 'Self',
      frequency: 'Recurring',
      user_id,
    });

    await this.donationRepository.save(donation);

    return {
      status: 'success',
      message: 'Subscription verified and first payment saved',
    };
  }
}
