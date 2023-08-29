import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
ConfigModule.forRoot({isGlobal: true}),
// TypeOrmModule.forRoot({
//   type: 'postgres',
//   url: process.env.DATABASE_URL,
//   autoLoadEntities: true,
//   synchronize: true,
//   // host: 'localhost', 
//   // port: 5432, 
//   // username: 'user',
//   // password: 'password',
//   // database: 'postgres',
//   // entities: [__dirname + '/**/*.entity{.ts,.js}'],

// }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
