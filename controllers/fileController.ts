import asyncHandler from 'express-async-handler';
import prisma from '../prisma/client';
import multer from 'multer';

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

const upload = multer({ dest: 'uploads/' });
export const file_upload_post = [
  upload.single('uploaded_file'),
  asyncHandler(async (req, res, next) => {
    console.log(req.file);
    console.log(req.body.file_name);
    res.redirect('/folders');
  }),
];

// export const file_upload_post
