import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UpdateCurrentUserDto } from './dto/update-current-user.dto';
import { hashSync } from 'bcrypt';
import { SALT_ROUNDS } from '../auth/auth.service';

@Injectable()
export class CurrentUserService {
  constructor(private readonly usersService: UsersService) {}

  async updateUser(
    user: User,
    updateUserDto: UpdateCurrentUserDto,
  ): Promise<User> {
    const { username, password } = updateUserDto;

    if (password) {
      const encryptedPassword = hashSync(password, SALT_ROUNDS);

      return this.usersService.update(user, {
        username,
        encryptedPassword,
      });
    }

    return this.usersService.update(user, { username });
  }
}
