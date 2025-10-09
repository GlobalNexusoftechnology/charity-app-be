import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/createorder.dto';
import { VerifyPaymentDto } from './dto/verifyorder.dto';
import { PaymentService } from './payment.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const { amount, donor_name, donor_email, donor_contact } = createOrderDto;
    return await this.paymentService.createOrder(
      amount,
      donor_name,
      donor_email,
      donor_contact,
    );
  }

  @Post('verify')
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      verifyPaymentDto;
    return await this.paymentService.verifyPayment(
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    );
  }

  @Get('donations')
  async getDonations() {
    return await this.paymentService.getDonations();
  }

  @Post('create-subscription')
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return await this.paymentService.createSubscription(createSubscriptionDto);
  }

  @Post('verify-subscription')
  async verifySubscription(@Body() body: any) {
    return await this.paymentService.verifyAndSaveSubscription(
      body.razorpay_payment_id,
      body.razorpay_subscription_id,
      body.razorpay_signature,
      body.user_id,
      body.amount,
      body.period,
      body.interval,
    );
  }
}
