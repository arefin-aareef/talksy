import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from '../messages/messages.service';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

// Add interface for message data
interface SendMessageData {
  receiverId: string;
  content: string;
  tempId?: string; // Optional tempId for frontend message matching
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private messagesService: MessagesService,
    private redisService: RedisService,
  ) {}

  afterInit(server: Server) {
    console.log('🔌 WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        client.disconnect();
        return;
      }

      client.userId = user._id.toString();
      client.user = user;

      // Store user socket connection in Redis
      await this.redisService.set(`user:${user._id}:socket`, client.id, 86400); // 24 hours

      // Update user online status
      await this.usersService.updateOnlineStatus(user._id.toString(), true);

      // Join user to their personal room
      client.join(`user:${user._id}`);

      // Notify other users that this user is online
      client.broadcast.emit('user-online', {
        userId: user._id,
        username: user.username,
        avatar: user.avatar,
      });

      console.log(
        `✅ User ${user.username} connected with socket ${client.id}`,
      );
    } catch (error) {
      console.error('❌ WebSocket connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      // Remove socket connection from Redis
      await this.redisService.del(`user:${client.userId}:socket`);

      // Update user offline status
      await this.usersService.updateOnlineStatus(client.userId, false);

      // Notify other users that this user is offline
      client.broadcast.emit('user-offline', {
        userId: client.userId,
      });

      console.log(`❌ User ${client.user?.username} disconnected`);
    }
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: SendMessageData, // Updated type
  ) {
    try {
      if (!client.userId) {
        return { error: 'Unauthorized' };
      }

      // Save message to database
      const message = await this.messagesService.createMessage(
        {
          receiver: data.receiverId,
          content: data.content,
        },
        client.userId,
      );

      // Get receiver socket ID from Redis
      const receiverSocketId = await this.redisService.get(
        `user:${data.receiverId}:socket`,
      );

      // Emit to receiver if online
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('new-message', {
          id: message._id,
          content: message.content,
          sender: message.sender,
          receiver: message.receiver,
          createdAt: message.createdAt,
          isRead: message.isRead,
        });
      }

      // Emit back to sender for confirmation
      client.emit('message-sent', {
        id: message._id,
        content: message.content,
        receiver: message.receiver,
        createdAt: message.createdAt,
        tempId: data.tempId, // Now properly typed as optional
      });

      return { success: true, messageId: message._id };
    } catch (error) {
      console.error('Error sending message:', error);
      return { error: 'Failed to send message' };
    }
  }

  @SubscribeMessage('mark-as-read')
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { messageId: string },
  ) {
    try {
      if (!client.userId) {
        return { error: 'Unauthorized' };
      }

      await this.messagesService.markAsRead(data.messageId, client.userId);

      return { success: true };
    } catch (error) {
      console.error('❌ Error marking message as read:', error);
      return { error: 'Failed to mark message as read' };
    }
  }

  @SubscribeMessage('typing-start')
  async handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { receiverId: string },
  ) {
    const receiverSocketId = await this.redisService.get(
      `user:${data.receiverId}:socket`,
    );
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('user-typing', {
        userId: client.userId,
        username: client.user?.username,
      });
    }
  }

  @SubscribeMessage('typing-stop')
  async handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { receiverId: string },
  ) {
    const receiverSocketId = await this.redisService.get(
      `user:${data.receiverId}:socket`,
    );
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('user-stop-typing', {
        userId: client.userId,
      });
    }
  }

  @SubscribeMessage('join-conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation:${data.conversationId}`);
    return { success: true };
  }

  @SubscribeMessage('leave-conversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation:${data.conversationId}`);
    return { success: true };
  }
}