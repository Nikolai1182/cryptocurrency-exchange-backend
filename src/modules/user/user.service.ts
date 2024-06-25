import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto';
import { WatchList } from '../watchlist/models/watchlist.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userRepo: typeof User) {}
  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  async findUserBindEmail(email: string): Promise<User> {
    try {
      return await this.userRepo.findOne({
        where: { email },
        include: {
          model: WatchList,
          required: false,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  async createUser(dto: CreateUserDto): Promise<CreateUserDto> {
    try {
      dto.password = await this.hashPassword(dto.password);
      await this.userRepo.create({
        firstName: dto.firstName,
        userName: dto.userName,
        email: dto.email,
        password: dto.password,
      });
      return dto;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async publicUser(email: string): Promise<User> {
    try {
      return this.userRepo.findOne({
        where: { email },
        attributes: { exclude: ['password'] },
        include: {
          model: WatchList,
          required: false,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async updateUser(email: string, dto: UpdateUserDto): Promise<UpdateUserDto> {
    try {
      await this.userRepo.update(dto, {
        where: { email },
      });
      return dto;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async deleteUser(email: string): Promise<boolean> {
    try {
      await this.userRepo.destroy({ where: { email } });
      return true;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
