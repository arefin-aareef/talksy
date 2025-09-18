// auth/dto/auth-response.dto.ts

export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    avatar: string;
    isOnline: boolean;
  };
}
