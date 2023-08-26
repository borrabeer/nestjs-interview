import { PartialType } from '@nestjs/swagger';
import { AuthDto } from '../../auth/dto/auth.dto';

export class UpdateCurrentUserDto extends PartialType(AuthDto) {}
