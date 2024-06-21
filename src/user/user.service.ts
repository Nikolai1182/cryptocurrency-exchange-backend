import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userRepo: typeof User) {}
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
  async createUser(dto): Promise<CreateUserDto> {
    dto.password = await this.hashPassword(dto.password);
    await this.userRepo.create(dto);
    return dto;
  }
}
