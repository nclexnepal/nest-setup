import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Role } from '../roles/schemas/role.schema';
import { Model, Types } from 'mongoose';
import { errorMessage } from 'src/helpers/response';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const {
      username,
      password,
      name,
      email,
      role,
      profile,
      employeeId,
    } = createUserDto;
    let userRole = null as any;
    if (role) {
      const gotRole = await this.roleModel.findOne({ _id: role }).exec();
      if (!gotRole) {
        return { message: 'Role not found' }
      }
      userRole = gotRole._id;
    }
    //to check whether
    if (!name || !username || name.trim().length === 0 || name.trim().length === 0 || username.trim().length === 0) {
      return errorMessage(
        'name and Username should not be empty',
        'name or username',
        400,
      );
    }

    const newuser = new this.userModel({});
    newuser.username = username;
    newuser.password = password;
    newuser.name = name;
    newuser.email = email;
    newuser.role = userRole;
    let hashedPassword;
    if (password) {
      try {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds);
      } catch (e) {
        throw e;
      }
    }
    newuser.password = hashedPassword;
    if (profile) {
      if (profile.profileIcon) newuser.profile.profileIcon = profile.profileIcon;
      if (profile.profileImage) newuser.profile.profileImage = profile.profileImage;
      if (profile.contact) newuser.profile.contact = profile.contact;
      if (profile.address) newuser.profile.address = profile.address;
      if (profile.dateOfBirth) newuser.profile.dateOfBirth = new Date(profile.dateOfBirth);
      if (profile.emergencyContact) newuser.profile.emergencyContact = profile.emergencyContact;
      if (profile.joinedDate) newuser.profile.joinedDate = new Date(profile.joinedDate);
      if (profile.leftDate) newuser.profile.leftDate = new Date(profile.leftDate);
    }
    if (employeeId) {
      newuser.employeeId = employeeId;
    }
    newuser.archive = false;
    const savedUser = await newuser.save();
    return savedUser;
  }

  async findAll(
    limit: number,
    page: number,
    search: string
  ) {
    const query = {};
    if (search) {
      query['$or'] = [
        { username: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const users = await this.userModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    const pagination = {
      page,
      limit,
      total: await this.userModel.countDocuments(query).exec(),
    };
    return { users, pagination };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(this.changeId(id))
      .populate('role')
      .exec();
    if (!user) return errorMessage('User not found', 'User');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) return errorMessage('User not found', 'User');
    user.archive = true;
    const updatedUser = await user.save();
    return updatedUser;

  }

  changeId(id: string): any {
    return new Types.ObjectId(id.toString());
  }
}
