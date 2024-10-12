import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/common/Guards/authorization/authorization.guard';
import { Roles } from 'src/common/Decorators/roles/roles.decorator';
import { PaymentService } from './payments.service';
import { RefundPaymentDto } from './dto/refund-payment/refund-payment.dto';

@Controller('payments')
@UseGuards(AuthenticationGuard)
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}
  @Roles('user')
  @Post('create')
  async createPayment(
    @Req() req,
    @Body('amount') amount: number,
    @Body('currency') currency: string,
  ) {
    const userId = req.user.id;
    return this.paymentService.createPayment(userId, amount, currency);
  }

  @Post('capture/:orderId')
  async capturePayment(@Param('orderId') orderId: string, @Req() req) {
    const userId = req.user.id;
    return this.paymentService.capturePayment(orderId, userId);
  }

  @UseGuards(AuthorizationGuard)
  @Roles('admin')
  @Post('refund/:paymentId')
  async refundPayment(
    @Param('paymentId') paymentId: string,
    @Body() refundPaymentDto: RefundPaymentDto,
  ) {
    return this.paymentService.refundPayment(paymentId, refundPaymentDto);
  }

  @Post('cancel/:orderId')
  async cancelPayment(@Param('orderId') orderId: string) {
    return this.paymentService.cancelPayment(orderId);
  }

  @Get('status/:paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.paymentService.getPaymentStatus(paymentId);
  }

  @Get('history')
  async getPaymentHistory(@Req() req) {
    const userId = req.user.id;
    return this.paymentService.getPaymentHistory(userId);
  }

  @Post('cash-on-delivery')
  @UseGuards(AuthenticationGuard)
  async createCashOnDeliveryPayment(
    @Req() req,
    @Body('amount') amount: number,
  ) {
    const userId = req.user.id;
    return this.paymentService.createCashOnDeliveryPayment(userId, amount);
  }
}
