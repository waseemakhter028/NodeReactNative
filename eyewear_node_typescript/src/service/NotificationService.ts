import UserModel from '../models/user';
import NotificationModel from '../models/notification';

class NotificationService {
  static async create(userId: string, title = 'title', body = 'body'): Promise<void> {
    try {
      const userInfo = await UserModel.findById(userId);

      if (userInfo) {
        await NotificationModel.create({
          user_id: userId,
          title: title,
          body: body,
        });
      }
    } catch (err: any) {
      throw Error(err);
    }
  }
}

export default NotificationService;
