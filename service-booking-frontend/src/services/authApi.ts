import type { LoginUserDto, RegisterUserDto } from "../types/auth";

const BASE_URL = 'http://localhost:8080/api/auth';

export async function registerUser(data: RegisterUserDto) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json(); 
  if (!res.ok) throw new Error(json.message);
  return json;
}

export async function loginUser(data: LoginUserDto) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Login failed');
  return await res.json();
}
