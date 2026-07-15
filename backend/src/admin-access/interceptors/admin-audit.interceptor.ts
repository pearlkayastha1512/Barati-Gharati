import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AdminAccessService } from '../admin-access.service';

@Injectable()
export class AdminAuditInterceptor implements NestInterceptor {
  constructor(
    private readonly adminAccessService: AdminAccessService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = String(request.method ?? 'GET').toUpperCase();

    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const actorId = request.user?.sub;
    const handler = context.getHandler().name;
    const resource = String(request.route?.path ?? request.url ?? 'admin');
    const resourceId = request.params?.id ?? request.params?.slug;

    return next.handle().pipe(
      tap(() => {
        if (!actorId) return;
        void this.adminAccessService
          .recordAudit(
            actorId,
            `${method.toLowerCase()}.${handler}`,
            resource,
            resourceId,
          )
          .catch(() => undefined);
      }),
    );
  }
}
