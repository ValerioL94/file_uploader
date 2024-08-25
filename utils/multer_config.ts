import multer from 'multer';
const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: { fileSize: 1048576, files: 1 },
});

export function getURI(buffer: Buffer, type: string) {
  const b64 = Buffer.from(buffer).toString('base64');
  let dataURI = 'data:' + type + ';base64,' + b64;
  return dataURI;
}
