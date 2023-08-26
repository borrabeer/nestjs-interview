import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CurrentUserController } from './current-user.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { CurrentUserService } from './current-user.service';

@Module({
  imports: [UsersModule],
  controllers: [CurrentUserController],
  providers: [JwtStrategy, CurrentUserService],
})
export class CurrentUserModule {}
