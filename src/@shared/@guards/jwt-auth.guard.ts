import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadType } from '@types';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: PayloadType = await this.jwtService.verifyAsync(token);

      if (payload.isBanned || payload.isDeleted) {
        throw new UnauthorizedException('banned user');
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('require Bearer token');
    }

    const [type, token] = authorization.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
