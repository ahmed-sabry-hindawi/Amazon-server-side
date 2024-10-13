import { RefundPaymentDto } from './dto/refund-payment/refund-payment.dto';
import { CreatePaymentDto } from './dto/create-payment/create-payment';
import { Injectable, BadRequestException } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentStatus } from './schemas/payment.schema';

@Injectable()
export class PaymentService {
  private payPalClient: paypal.core.PayPalHttpClient;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
  ) {
    const environment = new paypal.core.SandboxEnvironment(
      this.configService.get<string>('PAYPAL_CLIENT_ID'),
      this.configService.get<string>('PAYPAL_CLIENT_SECRET'),
    );
    this.payPalClient = new paypal.core.PayPalHttpClient(environment);
  }

  async createPayment(userId: string, amount: number, currency: string) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        },
      ],
    });

    try {
      const response = await this.payPalClient.execute(request);
      const orderId = response.result.id;

      await this.storePayment({
        userId,
        orderId,
        amount,
        transactionId: orderId,
        status: PaymentStatus.PENDING,
      });

      return response.result;
    } catch (error) {
      throw new BadRequestException(
        `PayPal Payment Creation Error: ${error.message}`,
      );
    }
  }

  async capturePayment(orderId: string, userId: string, retryCount = 0) {
    const payment = await this.paymentModel.findOne({ orderId, userId });
    if (!payment) {
      throw new BadRequestException('Payment not found or unauthorized');
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment has already been captured');
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);

    try {
      const response = await this.payPalClient.execute(request);

      if (response.result.status === 'COMPLETED') {
        await this.updatePaymentStatus(orderId, PaymentStatus.COMPLETED);
        return response.result;
      } else {
        throw new BadRequestException(
          `Unexpected payment status: ${response.result.status}`,
        );
      }
    } catch (error) {
      if (error.statusCode === 422) {
        await this.updatePaymentStatus(orderId, PaymentStatus.FAILED);
        console.error(
          `Compliance issue detected for order ${orderId}:`,
          JSON.stringify(error, null, 2),
        );
        throw new BadRequestException(
          'Payment capture failed due to a compliance issue. Please try using a different payment method or contact our support team for assistance.',
        );
      } else if (retryCount < 3) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1)),
        );
        return this.capturePayment(orderId, userId, retryCount + 1);
      }
      console.error(
        `PayPal Payment Capture Error for order ${orderId}:`,
        JSON.stringify(error, null, 2),
      );
      throw new BadRequestException(
        'Payment capture failed. Please try again later or contact our support team for assistance.',
      );
    }
  }

  async refundPayment(paymentId: string, refundDto: RefundPaymentDto) {
    const refundRequest = new paypal.payments.CapturesRefundRequest(paymentId);
    refundRequest.requestBody({
      amount: {
        value: refundDto.amount.toFixed(2),
        currency_code: refundDto.currency,
      },
    });

    try {
      const refund = await this.payPalClient.execute(refundRequest);
      return refund.result;
    } catch (error) {
      throw new BadRequestException(`Refund Error: ${error.message}`);
    }
  }

  async cancelPayment(orderId: string, userId: string) {
    const payment = await this.paymentModel.findOne({ orderId, userId });
    if (!payment) {
      throw new BadRequestException('Payment not found or unauthorized');
    }

    const cancelRequest = new paypal.orders.OrdersVoidRequest(orderId);
    try {
      const response = await this.payPalClient.execute(cancelRequest);
      await this.updatePaymentStatus(orderId, PaymentStatus.FAILED);
      return response.result;
    } catch (error) {
      throw new BadRequestException(`Cancel Payment Error: ${error.message}`);
    }
  }

  async getPaymentStatus(paymentId: string, userId: string) {
    const payment = await this.paymentModel
      .findOne({ _id: paymentId, userId })
      .exec();
    if (!payment) {
      throw new BadRequestException('Payment not found or unauthorized');
    }
    return payment.status;
  }

  async getPaymentHistory(userId: string) {
    return await this.paymentModel.find({ userId }).exec();
  }

  private async storePayment(createPaymentDto: CreatePaymentDto) {
    const newPayment = new this.paymentModel(createPaymentDto);
    return await newPayment.save();
  }

  private async updatePaymentStatus(orderId: string, status: PaymentStatus) {
    await this.paymentModel.findOneAndUpdate({ orderId }, { status }).exec();
  }

  async createCashOnDeliveryPayment(
    userId: string,
    amount: number,
  ): Promise<Payment> {
    const payment = new this.paymentModel({
      userId,
      amount,
      paymentMethod: 'cash_on_delivery',
      status: PaymentStatus.PENDING,
      transactionId: `COD-${Date.now()}`, // Generate a unique transaction ID for COD
    });
    return await payment.save();
  }
}
