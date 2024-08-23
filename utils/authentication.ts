import { Request, Response, NextFunction } from 'express';

export default function isAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/');
}
