import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import { errorMessage } from 'src/helpers/response';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly jwtService: JwtService,

  ) { }


  async login(
    loginUserDto: LoginUserDto
  ) {

    const {
      username,
      password,
    } = loginUserDto;

    const _user = await this.compareUser(loginUserDto);
    if (!_user)
      return errorMessage(
        'Username and password',
        'login',
        HttpStatus.BAD_REQUEST,
      );
    const token = this.generateJWT(_user);

    return { user: _user, token };
  }

  async compareUser({ username, password }: LoginUserDto) {
    const user = await this.userModel.findOne({ username }).select('+password').populate('role').exec();


    if (!user) {
      return errorMessage('Invalid Username or Password', 'User');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return errorMessage('Invalid Username or Password', 'User');
    }


    if (user.active == false) {
      return errorMessage('User is not active', 'User');
    }

    return user;
  }

  public generateJWT(user) {

    return this.jwtService.sign({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  }
}
