import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { generateToken } from '../utils/jwt.js';
import { config } from '../config/env.js';
import { LoginInput } from '../validators/authValidator.js';

export async function seedAdminUser(): Promise<void> {
  try {
    const existingAdmin = await Admin.findOne({ email: config.adminEmail.toLowerCase() });
    if (!existingAdmin) {
      console.log(`Seeding initial admin account: ${config.adminEmail}`);
      const hashedPassword = await bcrypt.hash(config.adminPassword, 10);
      await Admin.create({
        email: config.adminEmail.toLowerCase(),
        password: hashedPassword,
      });
      console.log('Admin account seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

export async function loginAdmin(input: LoginInput) {
  const admin = await Admin.findOne({ email: input.email.toLowerCase() });
  if (!admin) {
    throw { statusCode: 401, message: 'Invalid email or password' };
  }

  const isPasswordValid = await bcrypt.compare(input.password, admin.password);
  if (!isPasswordValid) {
    throw { statusCode: 401, message: 'Invalid email or password' };
  }

  const token = generateToken({
    userId: (admin._id as any).toString(),
    email: admin.email,
    role: 'admin',
  });

  return {
    user: {
      id: (admin._id as any).toString(),
      email: admin.email,
    },
    token,
  };
}
