import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) { }

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
    const conversations = await this.prismaService.conversation.findMany({
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

    // Transform conversations to match frontend expectations
    return conversations.map((conv) => ({
      id: conv.id,
      participants: conv.participants.map((p) => ({
        userId: p.userId,
        isSelf: p.userId === userId,
        user: {
          id: p.user.id,
          username: p.user.username,
        },
      })),
      messages: [],
      lastMessage: conv.messages[0]
        ? {
          id: conv.messages[0].id,
          text: conv.messages[0].text,
          senderId: conv.messages[0].senderId,
          conversationId: conv.messages[0].conversationId,
          createdAt: conv.messages[0].createdAt.toISOString(),
        }
        : undefined,
    }));
  }

  async getMessages(conversationId: string) {
    const messages = await this.prismaService.message.findMany({
      where: { conversationId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    });

    // Transform messages to match frontend expectations
    return messages.map((msg) => ({
      id: msg.id,
      text: msg.text,
      senderId: msg.senderId,
      conversationId: msg.conversationId,
      createdAt: msg.createdAt.toISOString(),
    }));
  }

  async createOrGetConversation(userId: number, receiverId: number) {
    if (userId === receiverId) {
      throw new NotFoundException(
        'Cannot create a conversation with yourself.',
      );
    }

    // Check if both users exist
    const receiver = await this.prismaService.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) throw new NotFoundException('Receiver not found.');

    // Check if conversation already exists
    const existing = await this.prismaService.conversation.findFirst({
      where: {
        participants: {
          every: {
            OR: [{ userId }, { userId: receiverId }],
          },
        },
      },
      include: {
        participants: { include: { user: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (existing) return existing;

    // Create new conversation
    const conversation = await this.prismaService.conversation.create({
      data: {
        participants: {
          create: [{ userId }, { userId: receiverId }],
        },
      },
      include: {
        participants: { include: { user: true } },
        messages: true,
      },
    });

    return conversation;
  }

  async createConversation(participantIds: number[]) {
    return this.prismaService.conversation.create({
      data: {
        participants: {
          create: participantIds.map((userId) => ({
            userId,
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
