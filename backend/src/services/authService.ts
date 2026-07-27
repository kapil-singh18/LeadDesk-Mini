import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { generateToken } from '../utils/jwt.js';
import { config } from '../config/env.js';
import { LoginInput } from '../validators/authValidator.js';

export async function seedAdminUser(): Promise<void> {
  try {
    const adminEmail = config.adminEmail.toLowerCase();
    const adminPassword = config.adminPassword;

    if (!adminPassword) {
      throw new Error(
        'ADMIN_SEED_PASSWORD or ADMIN_PASSWORD environment variable is required to seed admin user. Refusing startup without explicit password configuration.'
      );
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log(`Seeding initial admin account: ${adminEmail}`);
      await Admin.create({
        email: adminEmail,
        password: hashedPassword,
      });
      console.log('Admin account seeded successfully.');
    } else {
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log(`Updated seed password for admin account: ${adminEmail}`);
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
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
    userId: admin._id.toString(),
    email: admin.email,
    role: 'admin',
  });

  return {
    user: {
      id: admin._id.toString(),
      email: admin.email,
    },
    token,
  };
}
