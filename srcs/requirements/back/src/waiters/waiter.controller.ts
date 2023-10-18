<<<<<<< HEAD
import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
=======
import { Body, Controller, Post } from '@nestjs/common';
>>>>>>> 21e6fe95ab4ef746d866e9bd2bf9943066139f90
import { Waiter } from '@prisma/client';
import { WaiterService } from './waiter.service';
import { Prisma } from '@prisma/client';
import { warn } from 'console';

@Controller('waiter')
export class WaiterController {
  constructor(private readonly waiterService: WaiterService) {}

  @Post()
  async createWaiter(@Body() data: Prisma.WaiterCreateInput): Promise<Waiter> {
      return this.waiterService.createWaiter(data);
  }
<<<<<<< HEAD

  @Get()
  async getFirstWaiter(): Promise<Waiter>{
    return this.waiterService.getFirstWaiter();
  }
}
=======
}
>>>>>>> 21e6fe95ab4ef746d866e9bd2bf9943066139f90
