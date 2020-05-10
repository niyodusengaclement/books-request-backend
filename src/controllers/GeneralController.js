import { validateLogin, validatTimetable } from "../validators/validators";
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

  static async findBooks(req, res) {
    try {
      if(req.query.type === 'others') {
        const books = await pastorsModel.findOtherBooks();
        if(books.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', books);
      }
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

  static async findAllRequests(req, res) {
    try {
      const { role, field, id_code } = req.user;
      const { year, term, district } = req.query;

      if(req.query.type === 'others') return GeneralController.otherBooksRequests(req, res);
      
      if(role === 'field' && district !== 'all' ) {
        const all = await pastorsModel.findDistrictsRequests(field.toUpperCase(), year, term);
        if(all.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', all);
      }
      
      if(role === 'pastor') {
        const all = await pastorsModel.findPastorTotalRequestsByBook(id_code, year, term);
        if(all.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', all);
      }

      if(role === 'field' && district === 'all') {
        const all = await pastorsModel.findCertainFieldTotalRequests(field.toUpperCase(), year, term);
        if(all.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', all);
      }

      if((role === 'union' || role === 'admin') && district !== 'all') {
        const all = await pastorsModel.findFieldTotalRequestsByBook(year, term);
        if(all.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', all);
      }

      if((role === 'union' || role === 'admin') && district === 'all') {
        const all = await pastorsModel.findUnionTotalRequestsByBook(year, term);
        if(all.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', all);
      }

    } catch(err) {
      console.log(err)
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async otherBooksRequests(req, res) {
    try {
      const { role, field, id_code } = req.user;
      if(role === 'pastor') {
        const all = await pastorsModel.PastorOtherBooksRequests(id_code);
        if(all.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        const data = {
          requestType: 'others',
          requests: all, 
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', data);
      }
      if(role === 'field') {
        const all = await pastorsModel.FieldOtherBooksRequests(field.toUpperCase());
        if(all.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        const data = {
          requestType: 'others',
          requests: all, 
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', data);
      }
      if(role === 'admin' || role === 'union') {
        const all = await pastorsModel.UnionOtherBooksRequests();
        if(all.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        const data = {
          requestType: 'others',
          requests: all, 
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', data);
      }

    } catch (err) {
      console.log(err);
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async findAllChurches(req, res) {
    try {
      const { role, field } = req.user;
      if (role === 'admin' || role === 'union') {
        const churches = await pastorsModel.findAllChurches();
        if(churches.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', churches);
      }
      
      if(role === 'field') {
        const churches = await pastorsModel.findFieldChurches(field.toUpperCase());
        if(churches.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', churches);
      }

    } catch(err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }
  
  static async findDistrictsAndFields(req, res) {
    try {
      const { role, field } = req.user;

      if(role === 'admin' || role === 'union') {
        const fields = await pastorsModel.findAllFields();
        if(fields.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', fields);
      }

      if(role === 'field') {
        const ditricts = await pastorsModel.findDistricts(field.toUpperCase());
        if(ditricts.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', ditricts);
      }

    } catch(err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }
  
  static async findPastors(req, res) {
    try {
      const { role } = req.user;

      if(role === 'admin' || role === 'union') {
        const result = await pastorsModel.findPastors();
        if(result.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', result);
      }
    } catch(err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async dashboard(req, res) {
    try {
      const date = new Date();
      const year = date.getFullYear();
      const { role, field, id_code } = req.user;
      if (role === 'field') {
        const nbrs = await pastorsModel.findTotalNumbersByField(field.toUpperCase(), year);
        if(nbrs.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', nbrs);
      }
      if (role === 'pastor') {
        const nbrs = await pastorsModel.findTotalNumbersByPastor(id_code, year);
        if(nbrs.length < 1) {
          return onError(res, 404, 'Record(s) Not found');
        }
        return onSuccess(res, 200, 'Retrieved sussessfully', nbrs);
      }

      const nbrs = await pastorsModel.findTotalNumbersByUnion(year);
      if(nbrs.length < 1) {
        return onError(res, 404, 'Record(s) Not found');
      }
      return onSuccess(res, 200, 'Retrieved sussessfully', nbrs);

    } catch(err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async startAndDeadline(req, res) {
    try {
      const { role } = req.user;
      if (role !== 'union' && role !== 'admin') return onError (res, 403, 'Access denied, Admin only');
      const { error } = validatTimetable(req.body);
      if(error){
        const err = error.details[0].message.split('"').join('');
        return onError(res, 400, err);
      }
      const { term, year, startDate, endDate } = req.body;
      const values = [
        term,
        year,
        startDate,
        endDate,
      ];
      if(req.query.isUpdate === 'true') {
        const result = await pastorsModel.createTimetable(values);
        if(result) return onSuccess(res, 201, 'Timetable updated successfully', result);
      }
      const isExist = await pastorsModel.doesTimetableExist(term, year);
      if(isExist) return onError(res, 409, 'Timetable of this Quarter already exists');
      const result = await pastorsModel.createTimetable(values);
      if(result) return onSuccess(res, 201, 'Timetable created', result);

    } catch (err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async checkDeadline(req, res) {
    try {
      const result = await pastorsModel.checkTimetable();
      if(result) return onSuccess(res, 200, 'Timetable retrieved successfully', result)

    } catch (err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async uploadImage(req, res) {
    try {
    } catch (err) {
      console.log(err);
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async findYears(req, res) {
    try {
      const result = await pastorsModel.findYears();
      if(result.length < 1) return onError(res, 404, 'Years not found');
      if(result.length > 0) return onSuccess(res, 200, 'Years retrieved successfully', result);
      
    } catch (err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async findSingleRequest(req, res) {
    try {
      const { id } = req.params;
      const result = await pastorsModel.requestDetails(id);
      if(!result) return onError(res, 404, 'Record not found');
      if(result) return onSuccess(res, 200, 'Record retrieved successfully', result);
      
    } catch (err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async updateSingleRequest(req, res) {
    try {
      const { id } = req.params;
      const { command } = req.body;
      if(!command) return onError(res, 400, 'No request body provided');
      if(!id) return onError(res, 400, 'No request ID provided');
      const result = await pastorsModel.updateChurchRequest(command, id);
      if(result) return onSuccess(res, 200, 'Record updated successfully', result);
      
    } catch (err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async deliverBooks(req, res) {
    try {
      const { role } = req.user;
      const { id } = req.params;
      if(role !== 'field') return onError(res, 403, 'Access denied! Accessed by Field only');
      if(!id) return onError(res, 400, 'No request ID provided');
      const result = await pastorsModel.deliverBooks(id);
      if(result) return onSuccess(res, 200, 'Books Delivered successfully', result);
      
    } catch (err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async addBook(req, res) {
    try {
      const { role } = req.user;
      const { bookcategory, bookreader, bookname, description, booktype, language, price } = req.body;
      if(role !== 'union' && role !== 'admin' ) return onError(res, 403, 'Access denied!, Accessed by Admin or Union employee only');
      if(bookcategory !== 'other') {
        const values = [
          bookcategory,
          bookreader,
          booktype,
          language,
          price
        ];
        const result = await pastorsModel.addBook(values);
        if(result) return onSuccess(res, 201, `Book added successfully`);
      }
      const values = [
        bookname,
        description,
        language,
        price
      ];
      const result = await pastorsModel.addOtherBook(values);
      if(result) return onSuccess(res, 201, `Book added successfully`);
      
    } catch (err) {
      return onError(res, 500, 'Internal Server Error');
    }
  }

  static async getUserProfile(req, res) {
    try {
      console.log(req.user);
      const user = pastorsModel.findUserByUsername(req.user.username);
      if(!user) return onError(res, 404, 'User not found');
      return onSuccess(res, 200, 'User profile found', user);
    } catch (err) {
      console.log(err);
      return onError(res, 500, 'Internal Server Server');
    }
  }
}
