import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class DeleteSubscriptionDto {
  @ApiProperty()
  @IsUrl()
  endpoint: string;
}
