import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService {
	private readonly prisma = new PrismaClient();

	async executeQuery(query: string) {
		try {
			const result = await this.prisma.$queryRaw(query);
			return (result);
		}
		catch (error) {
			throw (error);
		}
		finally {
			await this.prisma.$disconnect();
		}
	}
}
