import jwt from 'jsonwebtoken';

class AuthMiddleware {
  checkToken(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({
        status: 401,
        error: 'No token provided! Provide token and try again',
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid token provided, check your token please',
      });
    }
  }
}
export default new AuthMiddleware();
