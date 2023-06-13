import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DeleteSubscriptionDto } from './subscriptions/dto/delete-subscription.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/notify-me')
  sendNotifications(@Body() { endpoint }: DeleteSubscriptionDto) {
    return this.appService.sendNotification(endpoint);
  }
}
