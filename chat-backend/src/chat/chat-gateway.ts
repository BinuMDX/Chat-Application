import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private chatService: ChatService) {}

  async handleConnection(client: Socket) {
    try {
      // Try to get token from auth object first, then from query params (for Postman testing)
      const token = client.handshake.auth.token || client.handshake.query.token;

      console.log('TOKEN RECEIVED:', token);

      if (!token) {
        console.log('NO TOKEN PROVIDED');
        client.disconnect();
        return;
      }

      const decoded = jwt.verify(token, 'at-secret') as any;
      console.log('DECODED:', decoded);

      client.data.user = decoded;
      console.log('CONNECTED:', decoded.sub);
    } catch (e) {
      console.log('INVALID TOKEN:', e.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('DISCONNECTED:', client.data.user?.id);
  }

  // JOIN room
  @SubscribeMessage('join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { conversationId }: { conversationId: string },
  ) {
    client.join(conversationId);
  }

  // SEND message
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { conversationId: string; text: string },
  ) {
    const senderId = client.data.user.sub;

    console.log('Sending message:', {
      conversationId: data.conversationId,
      senderId,
      content: data.text,
    });

    // Save into DB
    const msg = await this.chatService.saveMessage(
      data.conversationId,
      senderId,
      data.text,
    );

    // Broadcast to room
    this.server.to(data.conversationId).emit('message', msg);
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, conversationId: string) {
    this.server.to(conversationId).emit('typing', client.data.user.sub);
  }
}
