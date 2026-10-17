import messages from "../db/messages.js";
import { insertMessagesPost } from "../db/queries.js";

export default async function getNewMessage(req, res) {
  const text = req.body.message;
  const user = req.body.user;
  const added = new Date();

  const newMessage = { text, user, added };
  await insertMessagesPost(newMessage);
  res.redirect("/");
}
