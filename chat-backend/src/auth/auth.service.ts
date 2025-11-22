import { ForbiddenException, Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, LoginDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) { }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async signup(dto: AuthDto): Promise<Tokens> {
    // Check if user with username already exists
    const existingUserByUsername = await this.prismaService.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if user with email already exists
    const existingUserByEmail = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    const hashpassword = await this.hashData(dto.password);
    const newUser = await this.prismaService.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        hashpassword,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email, newUser.username);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }


  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException("Access Denied");
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.hashpassword,
    );

    if (!passwordMatches) {
      throw new Error('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email, user.username);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });

    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);

    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email, user.username);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
    const hashRt = await this.hashData(rt);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { hashedRt: hashRt },
    });
  }

  async getTokens(userId: number, email: string, username: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15, // 15 minutes
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7, // 7 days
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
      user: {
        id: userId,
        email,
        username,
      },
    };
  }

}
