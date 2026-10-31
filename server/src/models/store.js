import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// In-memory collections for fallback when MongoDB is offline
const memoryUsers = new Map();
const memoryAnalyses = new Map();

export const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * In-memory User store providing the same interface as Mongoose User model
 */
export const MemoryUser = {
  async create({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    for (const u of memoryUsers.values()) {
      if (u.email === normalizedEmail) {
        const error = new Error('An account with this email address already exists.');
        error.code = 11000;
        error.keyValue = { email: normalizedEmail };
        throw error;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = new mongoose.Types.ObjectId().toString();

    const user = {
      _id: id,
      id,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
      }
    };

    memoryUsers.set(id, user);
    return user;
  },

  findOne(query) {
    let result = null;
    if (query?.email) {
      const target = query.email.trim().toLowerCase();
      for (const u of memoryUsers.values()) {
        if (u.email === target) {
          result = { ...u, comparePassword: u.comparePassword };
          break;
        }
      }
    } else if (query?._id) {
      const u = memoryUsers.get(query._id.toString());
      if (u) result = { ...u, comparePassword: u.comparePassword };
    }

    const chain = Promise.resolve(result);
    chain.select = (projection) => {
      if (result && projection && !projection.includes('+password') && projection.includes('-password')) {
        const copy = { ...result };
        delete copy.password;
        return Promise.resolve(copy);
      }
      return Promise.resolve(result);
    };
    return chain;
  },

  findById(id) {
    const u = memoryUsers.get(id?.toString());
    const result = u ? { ...u, comparePassword: u.comparePassword } : null;
    const chain = Promise.resolve(result);
    chain.select = (projection) => {
      if (result && projection && projection.includes('-password')) {
        const copy = { ...result };
        delete copy.password;
        return Promise.resolve(copy);
      }
      return Promise.resolve(result);
    };
    return chain;
  }
};

/**
 * In-memory Analysis store providing the same interface as Mongoose Analysis model
 */
export const MemoryAnalysis = {
  async create(data) {
    const id = new mongoose.Types.ObjectId().toString();
    const record = {
      ...data,
      _id: id,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryAnalyses.set(id, record);
    return record;
  },

  find(query) {
    const userIdStr = query?.userId?.toString();
    const matched = [];
    for (const item of memoryAnalyses.values()) {
      if (!userIdStr || item.userId?.toString() === userIdStr) {
        matched.push(item);
      }
    }

    matched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const chain = Promise.resolve(matched);
    chain.select = () => chain;
    chain.sort = () => chain;
    return chain;
  },

  findOne(query) {
    const idStr = query?._id?.toString();
    const userIdStr = query?.userId?.toString();

    let result = null;
    if (idStr) {
      const item = memoryAnalyses.get(idStr);
      if (item && (!userIdStr || item.userId?.toString() === userIdStr)) {
        result = item;
      }
    }

    return Promise.resolve(result);
  },

  findOneAndDelete(query) {
    const idStr = query?._id?.toString();
    const userIdStr = query?.userId?.toString();

    let result = null;
    if (idStr) {
      const item = memoryAnalyses.get(idStr);
      if (item && (!userIdStr || item.userId?.toString() === userIdStr)) {
        memoryAnalyses.delete(idStr);
        result = item;
      }
    }

    return Promise.resolve(result);
  }
};

