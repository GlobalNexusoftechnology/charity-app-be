import { IsString, IsNumber, IsIn, Min } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @IsIn(['weekly', 'monthly', 'yearly'])
  period: 'weekly' | 'monthly' | 'yearly';

  @IsNumber()
  @Min(1)
  interval: number;

  @IsString()
  user_id: string;
}
