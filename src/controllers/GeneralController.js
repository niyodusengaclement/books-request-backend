import { validateLogin } from "../validators/validators";
import pastorsModel from "../model/pastorsModel";
import auth from "../utils/auth";
import { onError, onSuccess } from "../utils/response";
import { comparePassword, hashPassword } from "../utils/hash";

export default class GeneralController {
  static async login(req, res) {
    try {
      const { error } = validateLogin(req.body);
      if(error){
        const err = error.details[0].message.split('"').join('');
        return onError(res, 400, err);
      } 
      const { username, password } = req.body;
      const user = await pastorsModel.findUserByUsername(username);
      if(!user) {
        return onError(res, 401, 'Wrong username or password');
      }
      const compare = await comparePassword(password, user.password);
      if(!compare) return onError(res, 401, 'Wrong username or password');
      
      const info = {
        id: user.id,
        name: user.names,
        username,
        role: user.role,
        id_code: user.id_code,
        field: user.field,
      }
  
      const token = await auth.tokenGenerator(info);
      const data = {
        info,
        token
      };
      return onSuccess(res, 200, 'Login Successfully', data);
    } catch(err) {
      return onError(res, 500, 'Internal Server error');
    }
  }

  static async setupAccount(req, res) {    
    try {
      const { error } = validateLogin(req.body);
      if(error){
        const err = error.details[0].message.split('"').join('');
        return onError(res, 400, err);
      }
  
      const { name, login_code } = req.user;
  
      const pastor = await pastorsModel.findPastor(login_code);
      
      if(pastor.isactive === true) return onError(res, 403, 'Account already activated');
  
      const existUser = await pastorsModel.findUserByCode(login_code);
      
      if(existUser) return onError(res, 403, 'Account already activated');
  
      const { username, password} = req.body;
      const isExist = await pastorsModel.findUserByUsername(username);
      if(isExist) return onError(res, 400, 'Username already taken');
  
      const pass = await hashPassword(password);
      const values = [login_code, name, username, pass, 'pastor'];
      const user = await pastorsModel.createAccount(values);
  
      if(!user) {
        return onError(res, 400, 'Something went wrong, check your inputs');
      }
  
      await pastorsModel.activateAccount([login_code, true]);
  
      const info = {
        id: user.id,
        name: user.names,
        username,
        role: user.role,
        id_code: user.id_code,
        field: user.field,
      }
  
      const token = await auth.tokenGenerator(info);
      const data = {
        info,
        token
      };
      return onSuccess(res, 201, 'Account Successfully created', data);
    } catch(err) {
      return onError(res, 500, 'Internal Server error');
    }
  }

  static async findBooks(req, res) {
    try {
      const books = await pastorsModel.findBooks();
      if(books.length < 1) {
        return onError(res, 404, 'Record(s) Not found');
      }
      return onSuccess(res, 200, 'Retrieved sussessfully', books);

    } catch(err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async getLanguage(req, res) {
    try {
      const lge = await pastorsModel.findLanguages();
      if(lge.length < 1) {
        return onError(res, 404, 'Record(s) Not found');
      }
      return onSuccess(res, 200, 'Retrieved sussessfully', lge);

    } catch(err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }
}
