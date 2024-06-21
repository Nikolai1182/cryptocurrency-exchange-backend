import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('create-user')
  createUsers(@Body() dto: CreateUserDto) {
    console.log('dto', dto);

    return this.userService.createUser(dto);
  }
}
