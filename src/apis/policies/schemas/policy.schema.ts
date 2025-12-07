import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PolicyDocument = Policy & Document;

@Schema({ timestamps: true })
export class Policy {
  @Prop({ required: true, unique: true, type: String })
  name: string;

  @Prop(
    raw({
      canMANAGE: { type: Boolean, default: false },
      canCREATE: { type: Boolean, default: false },
      canREAD: { type: Boolean, default: false },
      canUPDATE: { type: Boolean, default: false },
      canDELETE: { type: Boolean, default: false },
      canVIEWALL: { type: Boolean, default: false },
    }),
  )
  action: Record<string, any>;
}

export const PolicySchema = SchemaFactory.createForClass(Policy);
