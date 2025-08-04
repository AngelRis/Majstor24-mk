import type { UserDto } from "./auth";
import type { ServiceDto } from "./serviceDto";

export interface ReviewDto {
  id: number;
  rating: number;
  comment: string;
  client: UserDto;
  service: ServiceDto;
  createdAt: string; 
}