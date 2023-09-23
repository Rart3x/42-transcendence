import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service.ts'

@Module({
	providers: [DatabaseService],
	export: [DatabaseService],
})

export class DatabaseModule {}
