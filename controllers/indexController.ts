import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

export const index_get = asyncHandler(async (req, res, next) => {
  res.render('index', { title: 'Homepage', user: req.user });
});
