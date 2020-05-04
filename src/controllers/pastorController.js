import { validateCommand } from "../validators/validators";
import pastorsModel from "../model/pastorsModel";
import auth from "../utils/auth";
import { onError, onSuccess } from "../utils/response";

export default class PastorController {
  static async sendOtp(req, res) {
    try {
    const { login_code } = req.body;
    if(!login_code){
      return onError(res, 400, 'Access ID is not allowed to be empty');
    }
    const user = await pastorsModel.findPastor(login_code);
    if(!user) {
      return onError(res, 401, 'Access ID not found');
    }
    if(user.isactive === true) {
      return onError(res, 403, 'Account already activated');
    }
    const info = {
      id: user.id,
      name: user.pastor_name,
      login_code,
      role: 'pastor'
    }

    const token = await auth.tokenGenerator(info);
    const data = {
      info,
      token
    };
    return onSuccess(res, 200, 'Access ID found successfully', data);
    } catch(err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async createCommand(req, res) {
    try {
      const { role } = req.user;
      if(role !== 'pastor')  {
        return onError(res, 403, 'Access denied! Pastors allowed only');
      }
      const { error } = validateCommand(req.body);
      if(error){
        const err = error.details[0].message.split('"').join('');
        return onError(res, 400, err);
      } 
      const { book, category, command, church, year, term } = req.body;
      const pastor = req.user.id_code;
      const body = [
        book,
        category,
        command,
        pastor,
        church,
        year,
        term
      ];
      const output = await pastorsModel.createCommand(body);
      if(output) return onSuccess(res, 201, 'Command successfully sent', output);
  
    } catch(err) {
      return onError(res, 500, 'Internal Server error');
    }
  }

  static async getCommandPerChurch(req, res) {
    try {
      const { id_code } = req.user;
      const { church, year, term } = req.query;
      if(!church || !year || !term ) return onError(res, 400, 'Write valid Church, year and term ');
      if(church === 'all') {
        const all = await pastorsModel.commandPerPastor(id_code, year, term);
        if(all.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', all);
      }
      const details = await pastorsModel.commandPerChurch(church, year, term);
      if(details.length < 1) {
        return onError(res, 404, 'Record(s) Not found');
      }
      return onSuccess(res, 200, 'Retrieved sussessfully', details);

    } catch(err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async getChurchesPerPastor(req, res) {
    try {
      const { id_code } = req.user;
      if(!id_code) return onError(res, 403, 'Access denied, Pastors only ');
      const churches = await pastorsModel.findChurchesPerPastor(id_code);
      if(churches.length < 1) return onError(res, 404, 'No churches yet');
      return onSuccess(res, 200, 'All churches you have are the following', churches);
    } catch(err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }
}