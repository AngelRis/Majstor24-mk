import type { UserDto } from "./auth";
import type { ServiceDto } from "./serviceDto";

export interface ReservationDto {
  id: number;
  date: string; 
  time: string;
  status: string;
  client: UserDto;
  service: ServiceDto;
  description: string;
}