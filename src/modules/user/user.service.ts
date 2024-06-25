import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto';
import { WatchList } from '../watchlist/models/watchlist.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userRepo: typeof User) {}
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
  async findUserBindEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }
  async createUser(dto: CreateUserDto): Promise<CreateUserDto> {
    dto.password = await this.hashPassword(dto.password);
    await this.userRepo.create({
      firstName: dto.firstName,
      userName: dto.userName,
      email: dto.email,
      password: dto.password,
    });
    return dto;
  }

  async publicUser(email: string) {
    return this.userRepo.findOne({
      where: { email },
      attributes: { exclude: ['password'] },
      include: {
        model: WatchList,
        required: false,
      },
    });
  }

  async updateUser(email: string, dto: UpdateUserDto): Promise<UpdateUserDto> {
    await this.userRepo.update(dto, {
      where: { email },
    });
    return dto;
  }

  async deleteUser(email: string): Promise<boolean> {
    await this.userRepo.destroy({ where: { email } });
    return true;
  }
}
