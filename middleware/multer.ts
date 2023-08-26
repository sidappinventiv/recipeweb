import multer from 'koa-multer';
const storage = multer.memoryStorage();
const upload= multer({ storage: storage });

export {upload}







// import { Request } from 'koa';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });
// export { upload };