import { Controller,  Post, Body} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { successMessage } from '../../helpers/response';


@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post()
  @ApiOperation({ summary: 'Logs Users in' })
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      return successMessage(
        'User logged In',
        await this.authenticationService.login(loginUserDto),
      );
    } catch (err) {
      throw err;
    }
  }
}
