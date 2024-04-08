import UserRepository from "../repositories/userRepositories";
import { User } from "../models/userModel";

class UserService {
  async createUser(user: Partial<User>): Promise<User> {
    return UserRepository.createUser(user);
  }
  async getUserById(id: string): Promise<User | null> {
    return UserRepository.getUserById(id);
  }
  async getAllUsers(): Promise<User[]> {
    return UserRepository.getAllUsers();
  }
  async getAllUsersWithCondition(admin: boolean): Promise<User[]> {
    return UserRepository.getAllUsersWithCondtion(admin);
  }
  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    return UserRepository.updateUser(id, user);
  }
  async getUserByEmail(email: string): Promise<User | null> {
    return UserRepository.getUserByEmail(email);
  }
}

export default new UserService();
