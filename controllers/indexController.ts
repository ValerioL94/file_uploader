import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

export const index = asyncHandler(async (req, res, next) => {
  res.render('index', { title: 'Homepage' });
});
