import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';

@Injectable()
export class PaymentService {
  private payPalClient: paypal.core.PayPalHttpClient;

  constructor(
    private configService: ConfigService,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {
    const environment = new paypal.core.SandboxEnvironment(
      this.configService.get('PAYPAL_CLIENT_ID'),
      this.configService.get('PAYPAL_CLIENT_SECRET'),
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

      // تخزين بيانات الدفع في الـ database
      await this.storePayment(userId, orderId, amount, orderId, 'pending');

      return response.result;
    } catch (error) {
      throw new Error(`PayPal Payment Creation Error: ${error.message}`);
    }
  }

  async capturePayment(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);

    try {
      const response = await this.payPalClient.execute(request);
      // تحديث حالة الدفع بعد الالتقاط
      await this.paymentModel
        .findOneAndUpdate({ orderId }, { status: 'completed' })
        .exec();

      return response.result;
    } catch (error) {
      throw new Error(`PayPal Payment Capture Error: ${error.message}`);
    }
  }

  async storePayment(
    userId: string,
    orderId: string,
    amount: number,
    transactionId: string,
    status: string,
  ) {
    const newPayment = new this.paymentModel({
      userId,
      orderId,
      amount,
      transactionId,
      status,
      paymentMethod: 'paypal',
    });

    return await newPayment.save();
  }

  // استرداد الأموال
  async refundPayment(paymentId: string, amount: number, currency: string) {
    const refundRequest = new paypal.payments.CapturesRefundRequest(paymentId);
    refundRequest.requestBody({
      amount: {
        value: amount.toFixed(2),
        currency_code: currency,
      },
    });

    try {
      const refund = await this.payPalClient.execute(refundRequest);
      return refund.result;
    } catch (error) {
      throw new Error(`Refund Error: ${error.message}`);
    }
  }

  // إلغاء الدفع
  async cancelPayment(orderId: string) {
    const cancelRequest = new paypal.orders.OrdersVoidRequest(orderId);
    try {
      const response = await this.payPalClient.execute(cancelRequest);

      await this.paymentModel
        .findOneAndUpdate({ orderId }, { status: 'canceled' })
        .exec();

      return response.result;
    } catch (error) {
      throw new Error(`Cancel Payment Error: ${error.message}`);
    }
  }

  // الحصول على حالة الدفع
  async getPaymentStatus(paymentId: string) {
    const payment = await this.paymentModel.findById(paymentId).exec();
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment.status;
  }

  // الحصول على سجل المدفوعات
  async getPaymentHistory(userId: string) {
    return await this.paymentModel.find({ userId }).exec();
  }
}
