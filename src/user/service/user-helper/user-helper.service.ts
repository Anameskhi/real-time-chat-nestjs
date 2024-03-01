import { LoginUserDto } from './../../model/dto/login-user.dto';
import { Observable, of } from 'rxjs';
import { CreateUserDto } from './../../model/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/user/model/user.interface';

@Injectable()
export class UserHelperService {
  CreateUserDtoTpEntity(createUserDto: CreateUserDto): Observable<IUser> {
    return of({
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
    });
  }
  loginUserDtoToEntity(loginUserDto: LoginUserDto): Observable<IUser> {
    return of({
      email: loginUserDto.email,
      password: loginUserDto.password,
    });
  }
}
