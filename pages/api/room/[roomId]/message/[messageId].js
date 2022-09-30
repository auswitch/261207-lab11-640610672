import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) 
{
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;

  const user = checkToken(req);
  if(!user)
  {
    return res.status(401).json({
      ok: false,
      message: "You don't permission to access this api",
    });
  }

  const rooms = readChatRoomsDB();

  const findroom = rooms.findIndex((x) => x.roomId === roomId);
  if(findroom === -1)
    return res.status(404).json({ ok: false, message: "Invalid room id" });
  
  const findmess = rooms[findroom].messages.findIndex((x) => x.messageId === messageId);
  if(findmess === -1)
    return res.status(404).json({ ok: false, message: "Invalid message id" });

  if(user.isAdmin === true || rooms[findroom].messages[findmess].username === user.username)
  {
    rooms[findroom].messages.splice(findmess, 1);
  }
  else
  {
    return res.status(403).json({ ok: false, message: "You do not have permission to access this data" });
  }
  writeChatRoomsDB(rooms);

  return res.json({ ok: true});
}
