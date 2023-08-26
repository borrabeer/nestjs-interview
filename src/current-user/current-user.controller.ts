import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/auth.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateCurrentUserDto } from './dto/update-current-user.dto';
import { CurrentUserService } from './current-user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Current User')
@ApiBearerAuth()
@Controller('current_user')
@UseGuards(JwtAuthGuard)
export class CurrentUserController {
  constructor(private readonly currentUserService: CurrentUserService) {}

  /*
   * TODO: Return current user
   */

  @Get()
  show(@CurrentUser() user): User {
    return user;
  }

  /*
   * TODO: Update current user
   */

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Body() updateUserDto: UpdateCurrentUserDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.currentUserService.updateUser(user, updateUserDto);
  }
}
