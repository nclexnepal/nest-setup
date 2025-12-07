import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './apis/users/users.module';
import { RolesModule } from './apis/roles/roles.module';
import { PoliciesModule } from './apis/policies/policies.module';

@Module({
  imports: [UsersModule, RolesModule, PoliciesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
