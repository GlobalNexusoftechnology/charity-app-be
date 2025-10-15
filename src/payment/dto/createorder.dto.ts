export class CreateOrderDto {
  amount: number;
  donor_name: string;
  donor_email: string;
  donor_contact: string;
  donation_type: string;
  donation_for?: string;
  frequency: 'One-Time' | 'Recurring';
  user_id?: string;
}
