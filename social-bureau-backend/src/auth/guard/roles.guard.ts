import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles?.length === 0) {
      return true; // No role specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming user object contains role information

    // Perform role-based authorization
    return roles.includes(user.role);
  }
}
