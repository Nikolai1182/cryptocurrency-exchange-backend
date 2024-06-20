import { Injectable } from '@nestjs/common';
import { users } from 'src/moks/index';

@Injectable()
export class UserService {
  getUsers() {
    return users;
  }
}
