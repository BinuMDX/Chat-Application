import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    providers: [ChatGateway, ChatService, PrismaService],
    controllers: [ChatController]
})
export class ChatModule {}
