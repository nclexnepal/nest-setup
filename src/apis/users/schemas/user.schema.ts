import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";


export type UserDocument = User & Document;

export class UserProfile {
  @Prop()
  profileIcon: string;

  @Prop()
  profileImage: string;

  @Prop()
  contact: string;

  @Prop()
  address: string;

  @Prop({ default: null })
  dateOfBirth: Date;

  @Prop()
  emergencyContact: string;

  @Prop({ default: null })
  joinedDate: Date;

  @Prop({ default: null })
  leftDate: Date;
}
@Schema({ timestamps: true })
export class User extends Document {

  @Prop({ required: true, unique: true, type: String })
  username: string;

  @Prop({ select: false })  // .select('+password')
  password: string;

  @Prop()
  name: string;

  @Prop({ default: false })
  active: boolean;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Types.ObjectId;

  @Prop({ default: false })
  archive: boolean;

  @Prop({ default: null })
  profile: UserProfile;

  @Prop()
  employeeId: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
