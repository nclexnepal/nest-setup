import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type RoleDocument = Role & Document;
export interface RolePolicy {
  policy: Types.ObjectId;
  MANAGE: boolean;
  CREATE: boolean;
  READ: boolean;
  UPDATE: boolean;
  DELETE: boolean;
  VIEWALL: boolean;
}
@Schema()
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop(
    raw([
      {
        policy: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy' },
        MANAGE: { type: Boolean, default: false },
        CREATE: { type: Boolean, default: false },
        READ: { type: Boolean, default: true },
        UPDATE: { type: Boolean, default: false },
        DELETE: { type: Boolean, default: false },
        VIEWALL: { type: Boolean, default: false },
      },
    ]),
  )
  policies: RolePolicy[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
