export interface ChatUserProps {
  name: string;
  externalId?: string;
}

export interface MessageProps {
  _id?: string;
  message: string;
  sentAt?: Date;
  user?: ChatUserProps;
}

export interface RoomProps {
  name: string;
  users: ChatUserProps[];
  messages: MessageProps[];
}

export interface JoinRoom {
  username: string;
  externalId: string;
  roomName: string;
}
