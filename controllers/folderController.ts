import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/client';

export const folders_get = asyncHandler(async (req, res, next) => {
  const folders = await prisma.folder.findMany();
  res.render('folders', { title: 'Your folders', user: req.user, folders });
});

export const folder_create_get = asyncHandler(async (req, res, next) => {
  res.render('folder_form', { title: 'New folder', user: req.user });
});

export const folder_create_post = asyncHandler(async (req, res, next) => {
  await prisma.folder.create({
    data: {
      title: req.body.title,
      user: { connect: { id: req.user.id } },
    },
  });
  res.redirect('/folders');
});
