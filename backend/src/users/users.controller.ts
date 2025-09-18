import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(ThrottlerGuard, JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers(@Request() req) {
    const users = await this.usersService.findAll();
    // Filter out current user
    return users.filter(
      (user) => user._id.toString() !== req.user._id.toString(),
    );
  }

  @Get('search')
  async searchUsers(@Query('q') query: string, @Request() req) {
    if (!query || query.trim().length < 2) {
      return [];
    }
    return this.usersService.searchUsers(query.trim(), req.user._id);
  }

  @Get('online')
  async getOnlineUsers(@Request() req) {
    const users = await this.usersService.getOnlineUsers();
    // Filter out current user
    return users.filter(
      (user) => user._id.toString() !== req.user._id.toString(),
    );
  }
}
