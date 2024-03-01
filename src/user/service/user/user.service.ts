import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Observable, from, map, mapTo, switchMap } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/user.entity';
import { IUser } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

const bcrypt = require('bcrypt');
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}
  create(newUser: IUser): Observable<IUser> {
    return this.mailExists(newUser.email).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return this.hashPassword(newUser.password).pipe(
            switchMap((passwordHash: string) => {
              newUser.password = passwordHash;
              return from(this.userRepository.save(newUser)).pipe(
                switchMap((user: IUser) => this.findOne(user.id)),
              );
            }),
          );
        } else {
          throw new HttpException(
            'Email is already in use',
            HttpStatus.CONFLICT,
          );
        }
      }),
    );
  }

  login(user: IUser): Observable<string> {
    return this.findByEmail(user.email).pipe(
      switchMap((foundUser: IUser) => {
        if (!foundUser) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return this.validatePassword(user.password, foundUser.password).pipe(
          switchMap((matches: boolean) => {
            if (!matches) {
              throw new HttpException(
                'Login was not successful, wrong credentials',
                HttpStatus.UNAUTHORIZED,
              );
            }

            return this.findOne(foundUser.id).pipe(
              switchMap((payload: IUser) => {
                return this.authService.generateJwt(payload);
              }),
            );
          }),
        );
      }),
    );
  }

  getAllUsers(options: IPaginationOptions): Observable<Pagination<IUser>> {
    return from(paginate<UserEntity>(this.userRepository, options));
  }

  private findByEmail(email: string): Observable<IUser> {
    return from(
      this.userRepository.findOne({
        where: { email: email },
        select: ['id', 'email', 'username', 'password'],
      }),
    );
  }

  private hashPassword(password: string): Observable<string> {
    return this.authService.hashPassword(password);
  }

  private validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Observable<any> {
    return this.authService.comparePassword(password, storedPasswordHash);
  }

  private findOne(id: number): Observable<IUser> {
    return from(
      this.userRepository.findOne({
        where: {
          id: id,
        },
      }),
    );
  }

  private mailExists(email: string): Observable<boolean> {
    return from(
      this.userRepository.findOne({
        where: {
          email: email,
        },
      }),
    ).pipe(
      map((user: IUser) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      }),
    );
  }
}
