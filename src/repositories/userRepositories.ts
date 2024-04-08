import UserModel, { User } from "../models/userModel";

class UserRepository {
  async createUser(user: Partial<User>): Promise<User> {
    return UserModel.create(user);
  }
  async getUserById(id: string): Promise<User | null> {
    return UserModel.findById(id).exec();
  }
  async getAllUsers(): Promise<User[]> {
    return UserModel.find().exec();
  }
  async getAllUsersWithCondtion(admin: boolean): Promise<User[]> {
    return UserModel.find({ admin }).exec();
  }
  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    return UserModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }
  async getUserByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).exec();
  }
}

export default new UserRepository();
