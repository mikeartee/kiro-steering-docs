---
title: "Node.js/Express Patterns"
description: "Guides Kiro to write Node.js and Express applications following best practices and patterns"
category: "practices"
tags: ["nodejs", "express", "api", "middleware", "typescript"]
inclusion: always
version: "1.0.0"
---

## Core Principle

**Kiro writes clean, maintainable Node.js and Express applications using modern patterns and proper error handling.** This steering document ensures APIs are well-structured, secure, and follow Express conventions.

## How Kiro Will Write Express Applications

### Route Organization

**Modular route structure**: Separate routes by resource

```typescript
// Kiro will write:
// routes/users.ts
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middleware/auth';
import { validateUser } from '../middleware/validation';

const router = Router();
const userController = new UserController();

router.get('/', authenticate, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.post('/', authenticate, validateUser, userController.createUser);
router.put('/:id', authenticate, validateUser, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

export default router;

// app.ts
import express from 'express';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

export default app;

// Not:
const app = express();

app.get('/api/users', (req, res) => { /* ... */ });
app.get('/api/users/:id', (req, res) => { /* ... */ });
app.post('/api/users', (req, res) => { /* ... */ });
app.get('/api/posts', (req, res) => { /* ... */ });
// All routes in one file
```

### Controller Pattern

**Separation of concerns**: Controllers handle request/response logic

```typescript
// Kiro will write:
// controllers/UserController.ts
import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { AppError } from '../utils/errors';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const users = await this.userService.findAll({ page, limit });

      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total: users.length
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;
      const newUser = await this.userService.create(userData);

      res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await this.userService.update(id, userData);

      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.delete(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

// Not:
app.get('/api/users/:id', async (req, res) => {
  const user = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
  res.json(user);
});
```

### Middleware Pattern

**Reusable middleware**: Authentication, validation, and error handling

```typescript
// Kiro will write:
// middleware/auth.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

// middleware/validation.ts
import { body, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const validateUser = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400, errors.array());
    }
    next();
  }
];

// Not:
app.post('/api/users', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  // Validation logic mixed with route handler
});
```

### Error Handling

**Centralized error handling**: Custom error classes and middleware

```typescript
// Kiro will write:
// utils/errors.ts
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// middleware/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    return;
  }

  // Unexpected errors
  console.error('Unexpected error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
};

// middleware/notFound.ts
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

// app.ts
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// ... routes ...

app.use(notFound);
app.use(errorHandler);

// Not:
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await findUser(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});
```

### Service Layer

**Business logic separation**: Services handle data operations

```typescript
// Kiro will write:
// services/UserService.ts
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from '../utils/errors';
import bcrypt from 'bcrypt';

interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

interface UpdateUserDto {
  email?: string;
  name?: string;
}

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async findAll(options: { page: number; limit: number }) {
    const offset = (options.page - 1) * options.limit;
    return this.userRepository.findAll(offset, options.limit);
  }

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async create(userData: CreateUserDto) {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return this.userRepository.create({
      ...userData,
      password: hashedPassword
    });
  }

  async update(id: string, userData: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }

    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new AppError('Email already in use', 409);
      }
    }

    return this.userRepository.update(id, userData);
  }

  async delete(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.userRepository.delete(id);
  }
}

// Not:
app.post('/api/users', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await db.query('INSERT INTO users ...', [req.body.email, hashedPassword]);
  res.json(user);
});
```

### Async Handler Wrapper

**DRY error handling**: Wrapper for async route handlers

```typescript
// Kiro will write:
// utils/asyncHandler.ts
import type { Request, Response, NextFunction } from 'express';

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage in routes:
import { asyncHandler } from '../utils/asyncHandler';

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.findById(req.params.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: user
  });
}));

// Not:
router.get('/:id', async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

### Configuration Management

**Environment-based config**: Centralized configuration

```typescript
// Kiro will write:
// config/index.ts
import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    origin: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'myapp',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  }
};

export default config;

// Not:
const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST || 'localhost';
// Scattered throughout the application
```

## What This Prevents

- **Spaghetti code** from mixing concerns in route handlers
- **Inconsistent error handling** across endpoints
- **Security vulnerabilities** from improper validation and authentication
- **Difficult testing** from tightly coupled code
- **Configuration chaos** from scattered environment variables
- **Unmaintainable routes** from monolithic route files

## Simple Examples

### Before/After: Complete API Endpoint

```typescript
// Before:
app.post('/api/users', async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    
    const existing = await db.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email exists' });
    }
    
    const hashed = await bcrypt.hash(req.body.password, 10);
    const result = await db.query('INSERT INTO users (email, password) VALUES (?, ?)', 
      [req.body.email, hashed]);
    
    res.status(201).json({ id: result.insertId, email: req.body.email });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// After:
// routes/users.ts
router.post('/', validateUser, userController.createUser);

// controllers/UserController.ts
createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userData = req.body;
    const newUser = await this.userService.create(userData);

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// services/UserService.ts
async create(userData: CreateUserDto) {
  const existingUser = await this.findByEmail(userData.email);
  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  return this.userRepository.create({
    ...userData,
    password: hashedPassword
  });
}

// middleware/validation.ts
export const validateUser = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400, errors.array());
    }
    next();
  }
];
```

## Customization

This is a starting point for Express patterns. You can customize by:

- Adding different database patterns (Prisma, TypeORM, Mongoose)
- Including authentication strategies (Passport.js, JWT)
- Adding API documentation (Swagger/OpenAPI)
- Incorporating rate limiting and security middleware

## Related Documents

- [TypeScript Formatting](../../code-formatting/typescript-formatting.md) - TypeScript conventions
- [Error Handling Standards](../../workflows/error-handling-standards.md) - Error patterns
- [API Development Patterns](../../workflows/api-development-patterns.md) - API conventions

## Optional: Validation with External Tools

Want to enforce these patterns automatically? Consider these tools:

### Express Development Tools (Optional)

```bash
# ESLint with TypeScript
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Testing tools
npm install --save-dev jest supertest @types/jest @types/supertest

# Security middleware
npm install helmet cors express-rate-limit
```

**Note**: These tools help enforce patterns but aren't required for the steering document to work.
