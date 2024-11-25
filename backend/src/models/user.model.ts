import { Schema, model, Document, Model } from "mongoose";
import { hash, compare } from "bcrypt";
import Conversation from "./conversation.model";
import { getUserSocket } from "../sockets";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  online?: boolean;
}

interface ConversationEmptyId {
  conversationId?: string;
  reciever: jsonUser;
}

export interface jsonUser {
  id?: string;
  fullName: string;
  email: string;
  online?: boolean;
}

interface IUserMethods {
  toJSON(): jsonUser;
  isValidPassword(password: string): Promise<boolean>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  findUsersByName(searchString: string, curUserId: string): Promise<jsonUser[]>;
}

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name is too short"],
      maxlength: [50, "Name is too long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Incorrect email format",
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password is too short"],
    },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.toJSON = function (): jsonUser {
  const user = this.toObject() as IUser;
  return {
    fullName: user.fullName,
    email: user.email,
    online: getUserSocket(user._id as string) ? true : false,
  };
};

UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<boolean> {
  return await compare(password, this.password);
};

UserSchema.statics.findUsersByName = async function (
  searchString: string,
  curUserId: string
): Promise<ConversationEmptyId[]> {
  try {
    const data = await User.find({
      fullName: { $regex: searchString, $options: "i" },
      _id: { $ne: curUserId },
    }).sort({ fullName: 1 });
    const transformedData: ConversationEmptyId[] = [];
    for (const user of data) {
      const conversation = await Conversation.getConversation(
        curUserId,
        user._id as string
      );
      if (!conversation) transformedData.push({ reciever: user });
      else
        transformedData.push({
          conversationId: conversation.conversationId.toString(),
          reciever: user,
        });
    }
    return transformedData;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const User = model<IUser, UserModel>("User", UserSchema);

export default User;
