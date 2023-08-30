import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { Observable, of } from 'rxjs';
import { IUser } from '../model/user.interface';
import { CreateUserDto } from '../model/dto/create-user.dto';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Post()
    create(@Body() createUserDto: CreateUserDto):Observable<Boolean>{
        return of(true)
    }

    @Get()
    findAll(){
        return of("hee")

    }

    @Post()
    login(){

    }

}
