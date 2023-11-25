import { Body, Controller, Get, Param, Post} from '@nestjs/common';
import { Notif, PrivateMessage } from '@prisma/client';
import { NotifService } from './notif.service';

@Controller('notif')
export class NotifController {
  constructor(private readonly notifService: NotifService) {}

	@Post('createNotif/:userName/')
	async createnotif(@Param('userName') userName: string, @Body() notifText: string): Promise<boolean> {
		return this.notifService.createNotif(userName, notifText);
	}

	@Get('getNotif/:userName/')
	async getnotif(@Param('userName') userName: string): Promise<Notif[]> {
		return this.notifService.getNotifs(userName);
	}
}