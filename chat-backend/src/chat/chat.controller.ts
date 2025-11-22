import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetCurrentUserId } from '../auth/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { CreateConversationDto } from './dtos/create-conversation.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) { }

  @Get('/conversations')
  getConversations(@GetCurrentUserId() userId: number) {
    return this.chatService.getConversations(userId);
  }

  @Get('/messages/:conversationId')
  getMessages(@Param('conversationId') id: string) {
    return this.chatService.getMessages(id);
  }

  @Post('/messages/:conversationId')
  sendMessage(
    @Param('conversationId') conversationId: string,
    @GetCurrentUserId() userId: number,
    @Body() dto: CreateMessageDto,
  ) {
    return this.chatService.saveMessage(conversationId, userId, dto.content);
  }

  @Post('conversation')
  async createConversation(
    @GetCurrentUserId() userId: number,
    @Body() dto: CreateConversationDto,
  ) {
    return this.chatService.createOrGetConversation(userId, dto.receiverId);
  }
}
