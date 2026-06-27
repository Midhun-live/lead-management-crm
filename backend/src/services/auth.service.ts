import { UserRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: Prisma.UserCreateInput) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(409, 'Email is already registered');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const { password, ...sanitized } = user;
    return sanitized;
  }

  async login(email: string, passwordInput: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await comparePassword(passwordInput, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'User account is deactivated');
    }

    const updatedUser = await this.userRepository.update(user.id, {
      lastLogin: new Date(),
    });

    const token = generateToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      tokenVersion: updatedUser.tokenVersion,
    });

    const { password, ...sanitized } = updatedUser;
    return { token, user: sanitized };
  }
}
