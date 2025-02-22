import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto';
import { AppError } from 'src/common/constants/error';
import { UserLoginDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { AuthUserResponse } from './response';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUsers(dto: CreateUserDto): Promise<CreateUserDto> {
    try {
      const existUser = await this.userService.findUserBindEmail(dto.email);
      if (existUser) throw new BadRequestException(AppError.USER_EXIST);
      return this.userService.createUser(dto);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async loginUser(dto: UserLoginDTO): Promise<AuthUserResponse> {
    try {
      const existUser = await this.userService.findUserBindEmail(dto.email);
      if (!existUser) throw new BadRequestException(AppError.USER_NOT_EXIST);
      const validatePassword = await bcrypt.compare(
        dto.password,
        existUser.password,
      );
      if (!validatePassword) throw new BadRequestException(AppError.WRONG_DATA);

      const user = await this.userService.publicUser(dto.email);
      const token = await this.tokenService.generateJwtToken(user);
      return { user, token };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
