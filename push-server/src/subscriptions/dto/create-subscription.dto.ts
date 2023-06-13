import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsUrl()
  endpoint: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  expirationTime: string;

  @ApiProperty()
  @ValidateNested()
  keys: {
    create: Keys;
  };
}

class Keys {
  @ApiProperty()
  @IsString()
  auth: string;

  @ApiProperty()
  @IsString()
  p256dh: string;
}
