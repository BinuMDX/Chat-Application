import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy { 
    constructor() {
        super(
            {
                datasources: {
                    db: {
                        url: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/chatapp",
                    },
                },
            }
        );    
    }

    onModuleInit() {
        return this.$connect();
    } 
    onModuleDestroy() {
        return this.$disconnect();
    }
}
