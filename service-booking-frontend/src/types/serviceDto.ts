import type { UserDto } from './auth';
import type { ReviewDto } from './reviewDto';
export interface ServiceDto {
  id: number;
  title: string;
  description: string;
  pricePerHour: number;
  city: string;
  provider: UserDto;
  workStartTime: string; 
  workEndTime: string;
  duration: number;
  daysOfWeek: string[];
  reviews: ReviewDto[];
  imageUrl: string;
  category: string;
  rating: number;
}