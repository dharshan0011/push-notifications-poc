import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import * as webpush from 'web-push';
@Injectable()
export class AppService {
  constructor(private readonly subscriptionService: SubscriptionsService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async sendNotification(endpoint: string) {
    const subscription = await this.subscriptionService.findOne(endpoint);
    if (!subscription) {
      throw new NotFoundException('Could not find any subscriptions');
    }
    const notification = JSON.stringify({
      title: 'Hello, Notifications!',
      options: {
        body: `ID: ${Math.floor(Math.random() * 100)}`,
      },
    });

    const vapidDetails = {
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY,
      subject: process.env.VAPID_SUBJECT,
    };

    console.log('vapidDetails', vapidDetails);
    // Customize how the push service should attempt to deliver the push message.
    // And provide authentication information.
    const options = {
      TTL: 10000,
      vapidDetails: vapidDetails,
    };

    const id = endpoint.substr(endpoint.length - 8, endpoint.length);
    console.log('id:>>>', id);
    try {
      const result = await webpush.sendNotification(
        subscription,
        notification,
        options,
      );
    } catch (err) {
      console.log('err:>>', err);
      throw err;
    }
    //   .then((result) => {
    //     console.log('result:>>>>', result);
    //     // console.log(`Endpoint ID: ${id}`);
    //     console.log(`Result: ${result.statusCode}`);
    //   })
    //   .catch((error) => {
    //     console.log(`Endpoint ID: ${id}`);
    //     console.log(`Error: ${error} `);
    //     throw new InternalServerErrorException(error.message);
    //   });
  }
}
