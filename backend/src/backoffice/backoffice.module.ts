import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BackofficeController } from './backoffice.controller';

@Module({
  imports: [HttpModule],
  controllers: [BackofficeController],
})
export class BackofficeModule {}
