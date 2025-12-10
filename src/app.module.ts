import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './apis/users/users.module';
import { RolesModule } from './apis/roles/roles.module';
import { PoliciesModule } from './apis/policies/policies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from './apis/authentication/authentication.module';

@Module({
  imports: [
    // Database 
    MongooseModule.forRoot(
      `mongodb+srv://prakashnclexnepal_db_user:sR65OhD7UvT5kIHI@cluster0.vqedmgx.mongodb.net/`,
    ),
    UsersModule,
    RolesModule,
    PoliciesModule,
    AuthenticationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
