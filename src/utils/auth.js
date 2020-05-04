import jwt from 'jsonwebtoken';

class authUtil {
  async tokenGenerator(data) {
    try {
      const secret = process.env.JWT_TOKEN;
      const token = jwt.sign(data, secret);
      return token;
    } catch (err) {
      return err;
    }
  }
}
export default new authUtil();
