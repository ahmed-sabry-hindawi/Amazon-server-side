import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/common/Guards/authorization/authorization.guard';
import { Roles } from 'src/common/Decorators/roles/roles.decorator';
import { PaymentService } from './payments.service';

@Controller('payments')
@UseGuards(AuthenticationGuard)
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(
    @Request() req,
    @Body('amount') amount: number,
    @Body('currency') currency: string,
  ) {
    const userId = req.user.id || req.user.userId;
    return this.paymentService.createPayment(userId, amount, currency);
  }

  // التقاط دفعة
  @Post('capture/:orderId')
  async capturePayment(@Param('orderId') orderId: string) {
    return this.paymentService.capturePayment(orderId);
  }

  @UseGuards(AuthorizationGuard)
  @Roles('admin')
  @Post('refund/:paymentId')
  async refundPayment(
    @Param('paymentId') paymentId: string,
    @Body('amount') amount: number,
    @Body('currency') currency: string,
  ) {
    return this.paymentService.refundPayment(paymentId, amount, currency);
  }

  // إلغاء دفعة
  @Post('cancel/:orderId')
  async cancelPayment(@Param('orderId') orderId: string) {
    return this.paymentService.cancelPayment(orderId);
  }

  // الحصول على حالة الدفع
  @Get('status/:paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.paymentService.getPaymentStatus(paymentId);
  }

  // عرض سجل المدفوعات لمستخدم معين
  @Get('history')
  async getPaymentHistory(@Request() req) {
    const userId = req.user.id || req.user.userId;
    return this.paymentService.getPaymentHistory(userId);
  }
}
