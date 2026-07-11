import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
// @WebSocketGateway({
//   cors: {
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   },
// })
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(conversationId);

    console.log(
      `Client ${client.id} joined ${conversationId}`,
    );
  }

  sendMessageToConversation(
    conversationId: string,
    message: any,
  ) {
    this.server.to(conversationId).emit(
      'newMessage',
      message,
    );
  }
}