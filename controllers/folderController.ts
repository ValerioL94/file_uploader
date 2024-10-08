import asyncHandler from 'express-async-handler';
import prisma from '../prisma/client';
import { Request, Response, NextFunction } from 'express';

export const folder_list_get = asyncHandler(async (req, res, next) => {
  const folders = await prisma.folder.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  res.render('folder_list', { title: 'Your folders', user: req.user, folders });
});

export const folder_create_get = asyncHandler(async (req, res, next) => {
  res.render('folder_form', {
    title: 'New folder',
    user: req.user,
    type: 'create',
  });
});

  interface authReq extends Request {
    user?: {
      id?: string;
    }
  }

export const folder_create_post = asyncHandler(async (req: authReq, res: Response, next: NextFunction) => {
  await prisma.folder.create({
    data: {
      title: req.body.title,
      user: { connect: { id: req.user?.id } },
    },
  });
  res.redirect('/folders');
});

export const folder_edit_get = asyncHandler(async (req, res, next) => {
  const folder = await prisma.folder.findUnique({
    where: { id: req.params.folderId },
  });
  res.render('folder_form', {
    title: 'Update folder',
    user: req.user,
    type: 'update',
    folder,
  });
});

export const folder_edit_post = asyncHandler(async (req, res, next) => {
  const newTitle = req.body.title;
  await prisma.folder.update({
    where: { id: req.params.folderId },
    data: { title: newTitle },
  });
  res.redirect('/folders');
});

export const folder_delete_get = asyncHandler(async (req, res, next) => {
  await prisma.folder.delete({
    where: { id: req.params.folderId },
  });
  res.redirect('/folders');
});
