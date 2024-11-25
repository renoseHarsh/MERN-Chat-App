import express from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import {
  getAllUserConversations,
  createConversation,
  getMessagesInConversation,
  sendMessageToConversation,
} from "../controllers/conversation.controller";

const router = express.Router();

router.get("/", authenticateJWT, getAllUserConversations);
router.post("/", authenticateJWT, createConversation);
router.get(
  "/:conversationId/messages",
  authenticateJWT,
  getMessagesInConversation
);
router.post(
  "/:conversationId/messages",
  authenticateJWT,
  sendMessageToConversation
);
export default router;
