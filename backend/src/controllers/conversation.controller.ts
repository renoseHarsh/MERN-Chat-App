import mongoose, { Schema } from "mongoose";
import { IUserRequest } from "../definitionfile";
import Conversation, { IMessage } from "../models/conversation.model";
import { Response } from "express";
import User from "../models/user.model";
import { getUserSocket, io } from "../sockets";

export const getAllUserConversations = async (
  req: IUserRequest,
  res: Response
): Promise<any> => {
  const userId = req.user!.id;
  try {
    const conversations = await Conversation.getAllByUserId(userId);
    return res.status(200).json({ message: "Success", conversations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createConversation = async (
  req: IUserRequest,
  res: Response
): Promise<any> => {
  if (!req.body.email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const userId = req.user!.id;
    const email = req.body.email;
    if (email === req.user!.email) {
      return res
        .status(400)
        .json({ message: "Cannot create conversation with self" });
    }
    const reciever = await User.findOne({ email });
    if (!reciever) {
      return res.status(404).json({ message: "User not found" });
    }
    if (await Conversation.getConversation(userId, reciever._id as string))
      return res.status(400).json({ message: "Conversation already exists" });
    const conversation = new Conversation({
      participants: [userId, reciever._id],
    });
    conversation.save();
    const userSocket = getUserSocket(reciever._id as string);
    if (userSocket) {
      io.to(userSocket.id).emit("onlineUser", {
        conversation: await conversation.toJSON(reciever._id as string),
        trueOnline: true,
      });
    }
    return res.status(200).json({
      message: "Success",
      id: (await conversation.toJSON(userId)).conversationId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesInConversation = async (
  req: IUserRequest,
  res: Response
): Promise<any> => {
  const conversationId = req.params.conversationId;
  if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ message: "Conversation ID is required" });
  }
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (!conversation.isParticipant(req.user!.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.status(200).json({
      message: "Success",
      data: conversation.messagesToJSON(req.user!.id.toString()),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessageToConversation = async (
  req: IUserRequest,
  res: Response
): Promise<any> => {
  const conversationId = req.params.conversationId;
  const senderId = req.user!.id;
  if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ message: "Conversation ID is required" });
  }
  const content = req.body.content;
  if (!content) {
    return res.status(400).json({ message: "Content is missing" });
  }
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (!conversation.isParticipant(senderId)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const message: IMessage = {
      senderId: senderId as unknown as Schema.Types.ObjectId,
      content,
    };
    conversation.messages.push(message);
    await conversation.save();
    const senderSocket = getUserSocket(senderId);
    if (senderSocket) {
      io.to(senderSocket.id).emit("newMessage", {
        isSender: true,
        content: message.content,
      });
    }
    const recieverId = conversation.participants.find(
      (participant) => senderId != participant.toString()
    );
    const recieverSocket = getUserSocket(recieverId!.toString());
    if (recieverSocket) {
      io.to(recieverSocket.id).emit("newMessage", {
        isSender: false,
        content: message.content,
      });
    }
    return res.status(201).json({ message: "Message sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
