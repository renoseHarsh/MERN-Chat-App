import mongoose, { Document, Model, model, Schema } from "mongoose";
import User, { jsonUser } from "./user.model";

export interface IMessage {
  senderId: Schema.Types.ObjectId;
  content: string;
}

export interface jsonMessage {
  isSender: boolean;
  content: string;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500,
  },
});

interface IConversation extends Document {
  participants: Schema.Types.ObjectId[];
  messages: IMessage[];
}

export interface jsonConversation {
  conversationId: mongoose.Types.ObjectId;
  reciever: jsonUser;
}

interface IConversationMethods {
  toJSON(userId: string): Promise<jsonConversation>;
  isParticipant(userId: string): boolean;
  messagesToJSON(userId: string): jsonMessage[];
}

interface ConversationModel
  extends Model<IConversation, {}, IConversationMethods> {
  getAllByUserId(userId: string): Promise<jsonConversation[]>;
  getConversation(
    senderId: string,
    recieverId: string
  ): Promise<jsonConversation | undefined>;
}

const ConversationSchema = new Schema<
  IConversation,
  ConversationModel,
  IConversationMethods
>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
    ],
    messages: { type: [MessageSchema], default: [] },
  },
  { timestamps: true }
);

ConversationSchema.methods.toJSON = async function (
  userId: string
): Promise<jsonConversation> {
  const recieverId = this.participants.find((id) => {
    return id.toString() !== userId.toString();
  });
  const reciever = await User.findById(recieverId);
  const preReturn = {
    conversationId: this._id,
    reciever,
  };
  return preReturn as jsonConversation;
};

ConversationSchema.methods.isParticipant = function (userId: string): boolean {
  return this.participants.some((id) => id.toString() === userId.toString());
};

ConversationSchema.methods.messagesToJSON = function (userId: string) {
  const messages: IMessage[] = this.messages;
  return messages.map((message) => ({
    isSender: message.senderId.toString() === userId,
    content: message.content,
  }));
};

ConversationSchema.statics.getConversation = async function (
  senderId: string,
  recieverId: string
): Promise<jsonConversation | undefined> {
  const conversation = await this.findOne({
    participants: { $all: [senderId, recieverId] },
  });
  if (conversation) return conversation.toJSON(senderId);
  return undefined;
};

ConversationSchema.statics.getAllByUserId = async function (
  userId: string
): Promise<jsonConversation[]> {
  const conversations = await this.find({ participants: userId }).sort({
    updatedAt: -1,
  });
  return await Promise.all(conversations.map((conv) => conv.toJSON(userId)));
};

const Conversation = model<IConversation, ConversationModel>(
  "Conversation",
  ConversationSchema
);

export default Conversation;
