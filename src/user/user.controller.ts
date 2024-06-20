import { Controller, Get } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('get-all-users')
  getUsers() {
    return this.userService.getUsers();
  }
}
