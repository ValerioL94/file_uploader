import asyncHandler from 'express-async-handler';
import prisma from '../prisma/client';
import { upload, getURI } from '../utils/multer_config';
import { handleUpload } from '../utils/cloudinary_config';

export const file_list_get = asyncHandler(async (req, res, next) => {
  const folder = await prisma.folder.findUnique({
    where: { id: req.params.folderId },
    include: { files: true },
  });
  res.render('file_list', {
    title: folder?.title,
    folder,
    files: folder?.files,
    user: req.user,
  });
});

export const file_upload_get = asyncHandler(async (req, res, next) => {
  res.render('file_form', {
    title: 'File upload',
    user: req.user,
    type: 'create',
  });
});

export const file_upload_post = [
  upload.single('uploaded_file'),
  asyncHandler(async (req, res, next) => {
    const folder = await prisma.folder.findUnique({
      where: { id: req.params.folderId },
    });
    if (!req.file) {
      return res.render('file_form', {
        title: 'File upload',
        user: req.user,
        error: 'No file selected',
      });
    }
    if (req.file && req.file.size > 1048576) {
      return res.render('file_form', {
        title: 'File upload',
        user: req.user,
        error: 'File size exceeded',
      });
    }
    const dataURI = getURI(req.file.buffer, req.file.mimetype);
    const result = await handleUpload(dataURI, folder!.title);
    await prisma.file.create({
      data: {
        title: req.body.file_name,
        size: result.bytes,
        url: result.secure_url,
        resource_type: result.resource_type,
        format: result.format,
        folder: { connect: { id: folder!.id } },
      },
    });
    res.redirect(`/folders/${folder!.id}/files`);
  }),
];

export const file_detail_get = asyncHandler(async (req, res, next) => {
  const file = await prisma.file.findUnique({
    where: { id: req.params.fileId },
  });
  res.render('file_detail', { title: file?.title, file, user: req.user });
});

export const file_edit_get = asyncHandler(async (req, res, next) => {
  const file = await prisma.file.findUnique({
    where: { id: req.params.fileId },
  });
  res.render('file_form', {
    title: 'Update file title',
    user: req.user,
    type: 'update',
    file,
  });
});
export const file_edit_post = asyncHandler(async (req, res, next) => {
  const newTitle = req.body.file_name;
  await prisma.file.update({
    where: { id: req.params.fileId },
    data: { title: newTitle },
  });
  res.redirect(`/folders/${req.params.folderId}/files`);
});

export const folder_delete_get = asyncHandler(async (req, res, next) => {
  await prisma.folder.delete({
    where: { id: req.params.folderId },
  });
  res.redirect('/folders');
});

export const file_delete_get = asyncHandler(async (req, res, next) => {
  await prisma.file.delete({
    where: { id: req.params.fileId },
  });
  res.redirect(`/folders/${req.params.folderId}/files`);
});

import https from 'https';
export const file_download_get = asyncHandler(async (req, res, next) => {
  const file = await prisma.file.findUnique({
    where: { id: req.params.fileId },
  });
  const fileName = `${file?.title}.${file?.format}`;
  https.get(file!.url, function (myfile) {
    res.set(
      'Content-disposition',
      'attachment; filename=' + encodeURI(fileName)
    );
    res.set({ 'Content-Type': `${file?.resource_type}/${file?.format}` });
    myfile.pipe(res);
  });
});
