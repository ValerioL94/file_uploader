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
  res.render('file_form', { title: 'File upload', user: req.user });
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
        folder: { connect: { id: folder!.id } },
      },
    });
    res.redirect(`/folders/${folder!.id}/files`);
  }),
];

// export const file_upload_post
