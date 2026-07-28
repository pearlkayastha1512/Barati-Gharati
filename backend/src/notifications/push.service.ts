import { Injectable } from '@nestjs/common';
import { Expo } from 'expo-server-sdk';
import { PrismaService } from '../prisma/prisma.service';

const expo = new Expo();

@Injectable()
export class PushService {
  constructor(private readonly prisma: PrismaService) {}

  async sendPushToUser(
    userId: string,
    title: string,
    body: string,
    data: Record<string, any> = {},
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { pushToken: true },
    });

    if (!user?.pushToken || !Expo.isExpoPushToken(user.pushToken)) {
      // web user ya token missing — silently skip, koi error nahi
      return;
    }

    try {
      await expo.sendPushNotificationsAsync([
        {
          to: user.pushToken,
          sound: 'default',
          title,
          body,
          data,
        },
      ]);
    } catch (error) {
      console.log('PUSH NOTIFICATION ERROR =>', error);
      // push fail hone se poora notification creation flow fail nahi hona chahiye
    }
  }
}