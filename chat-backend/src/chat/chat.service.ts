import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  createMessage(senderId: number, conversationId: string, text: string) {
    return this.prismaService.message.create({
      data: {
        senderId,
        conversationId,
        text,
      },
      include: {
        sender: true,
      },
    });
  }

  async saveMessage(conversationId: string, senderId: number, content: string) {
    return this.prismaService.message.create({
      data: { conversationId, senderId, text: content },
      include: { sender: true },
    });
  }

  async getConversations(userId: number) {
    return this.prismaService.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: { include: { user: true } },
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async getMessages(conversationId: string) {
    return this.prismaService.message.findMany({
      where: { conversationId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
