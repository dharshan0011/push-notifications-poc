import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const createdSubscription = await this.prisma.subscription.create({
      data: createSubscriptionDto,
      include: {
        keys: true,
      },
    });
    return createdSubscription;
  }

  findAll() {
    return `This action returns all subscriptions`;
  }

  async findOne(endpoint: string) {
    return await this.prisma.subscription.findFirst({
      where: {
        endpoint,
      },
      include: {
        keys: true,
      },
    });
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  async remove(endpoint: string) {
    const existingSubscription = await this.prisma.subscription.findFirst({
      where: {
        endpoint,
      },
    });
    return await this.prisma.subscription.delete({
      where: {
        id: existingSubscription.id,
      },
    });
  }
}
