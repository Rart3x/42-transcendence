import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Waiter, Prisma } from '@prisma/client';

@Injectable()
export class WaiterService {
  constructor (private prisma: PrismaService) {}

  async createWaiter(data: Prisma.WaiterCreateInput): Promise<Waiter> {
    return this.prisma.waiter.create({
        data,
    });
  }

  async getTotalWaiters(): Promise<number> {
    const totalWaiters = await this.prisma.waiter.count();
    return totalWaiters;
  }
}