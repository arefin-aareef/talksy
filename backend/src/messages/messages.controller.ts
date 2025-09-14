import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Patch,
  Delete,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(ThrottlerGuard, JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  async sendMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
  ) {
    return this.messagesService.createMessage(createMessageDto, req.user._id);
  }

  @Get('conversations')
  async getConversations(@Request() req) {
    return this.messagesService.getUserConversations(req.user._id);
  }

  @Get('conversation/:userId')
  async getConversation(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Request() req,
  ) {
    return this.messagesService.getConversation(
      req.user._id,
      userId,
      page,
      limit,
    );
  }

  @Patch(':messageId/read')
  async markAsRead(@Param('messageId') messageId: string, @Request() req) {
    await this.messagesService.markAsRead(messageId, req.user._id);
    return { message: 'Message marked as read' };
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const count = await this.messagesService.getUnreadCount(req.user._id);
    return { count };
  }

  @Delete(':messageId')
  async deleteMessage(@Param('messageId') messageId: string, @Request() req) {
    await this.messagesService.deleteMessage(messageId, req.user._id);
    return { message: 'Message deleted successfully' };
  }
}
