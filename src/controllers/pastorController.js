import fs from "fs";
import readXlsxFile from "read-excel-file/node";
import {
  validateCommand,
  validateOtherBooksRequest,
  validateChurch,
  validateLogin,
} from "../validators/validators";
import pastorsModel from "../model/pastorsModel";
import auth from "../utils/auth";
import { onError, onSuccess } from "../utils/response";
import { hashPassword } from "../utils/hash";

export default class PastorController {
  static async sendOtp(req, res) {
    try {
      const { login_code } = req.body;
      if (!login_code) {
        return onError(res, 400, "Access ID is not allowed to be empty");
      }
      const user = await pastorsModel.findPastor(login_code);
      if (!user) {
        return onError(res, 401, "Access ID not found");
      }
      if (user.isactive === true) {
        return onError(res, 403, "Account already activated");
      }
      const info = {
        id: user.id,
        name: user.pastor_name,
        login_code,
        role: "pastor",
      };

      const token = await auth.tokenGenerator(info);
      const data = {
        info,
        token,
      };
      return onSuccess(res, 200, "Access ID found successfully", data);
    } catch (err) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  static async setupAccount(req, res) {
    try {
      const { error } = validateLogin(req.body);
      if (error) {
        const err = error.details[0].message.split('"').join("");
        return onError(res, 400, err);
      }

      const { name, login_code } = req.user;

      const pastor = await pastorsModel.findPastor(login_code);

      if (pastor.isactive === true)
        return onError(res, 403, "Account already activated");

      const existUser = await pastorsModel.findUserByCode(login_code);

      if (existUser) return onError(res, 403, "Account already activated");

      const { username, password } = req.body;
      const isExist = await pastorsModel.findUserByUsername(username);
      if (isExist) return onError(res, 400, "Username already taken");

      const pass = await hashPassword(password);
      const values = [login_code, name, username, pass, "pastor"];
      const user = await pastorsModel.createAccount(values);

      if (!user) {
        return onError(res, 400, "Something went wrong, check your inputs");
      }

      await pastorsModel.activateAccount([login_code, true]);

      const info = {
        id: user.id,
        name: user.names,
        username,
        role: user.role,
        id_code: user.id_code,
        field: user.field,
      };

      const token = await auth.tokenGenerator(info);
      const data = {
        info,
        token,
      };
      return onSuccess(res, 201, "Account Successfully created", data);
    } catch (err) {
      console.log(err);
      return onError(res, 500, "Internal Server error");
    }
  }

  static async createCommand(req, res) {
    try {
      if (req.query.type === "others") {
        const { error } = validateOtherBooksRequest(req.body);
        if (error) {
          const err = error.details[0].message.split('"').join("");
          return onError(res, 400, err);
        }
        const { id_code, bookid, church_id, request } = req.body;
        const body = [id_code, church_id, bookid, request];
        const output = await pastorsModel.createOtherBooksRequest(body);
        if (output)
          return onSuccess(res, 201, "Request successfully sent", output);
      }

      const { error } = validateCommand(req.body);
      if (error) {
        const err = error.details[0].message.split('"').join("");
        return onError(res, 400, err);
      }
      const { id_code, command, church, year, term, category, name } = req.body;
      const values = [id_code, church, category, year, term];
      // const isExist = await pastorsModel.commandIsExist(values);
      // if (isExist)
      //   return onError(
      //     res,
      //     409,
      //     "The Request already exist. Update the Request instead"
      //   );
      const body = [id_code, church, command, year, term, category, name];
      const output = await pastorsModel.createCommand(body);
      if (output)
        return onSuccess(res, 201, "Request successfully sent", output);
    } catch (err) {
      console.log(err);
      return onError(res, 500, "Internal Server error");
    }
  }

  static async getCommandPerChurch(req, res) {
    try {
      const { id_code } = req.user;
      const { year, term } = req.query;
      if (!year || !term)
        return onError(res, 400, "Write valid Church, year and term ");

      const details = await pastorsModel.findChurchRequests(
        id_code,
        year,
        term
      );
      if (details.length < 1) {
        return onError(res, 404, "Record(s) Not found");
      }
      return onSuccess(res, 200, "Retrieved sussessfully", details);
    } catch (err) {
      console.log(err);

      return onError(res, 500, "Internal Server Error");
    }
  }

  static async getChurchesPerPastor(req, res) {
    try {
      const { id_code } = req.user;
      if (!id_code) return onError(res, 403, "Access denied, Pastors only ");
      const churches = await pastorsModel.findChurchesPerPastor(id_code);
      if (churches.length < 1) return onError(res, 404, "No churches yet");
      return onSuccess(
        res,
        200,
        "All churches you have are the following",
        churches
      );
    } catch (err) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  static async uploadPastors(req, res) {
    try {
      const { role } = req.user;
      if (role === "union" || role === "admin") {
        if (!req.files) return onError(res, 400, "No file selected");
        if (!req.files.list) return onError(res, 400, "No file selected");
        const arr = req.files.list.name.split(".");
        const lastIndex = arr.length - 1;
        const extension = arr[lastIndex];
        if (extension !== "xlsx" && extension !== "xlsm")
          return onError(
            res,
            400,
            "File should be an excel with [xlsx or xlsm] extension"
          );
        const fileRows = [];
        const schema = {
          "PASTOR NAMES": {
            prop: "names",
            type: String,
            required: true,
          },
        };

        const { rows, errors } = await readXlsxFile(
          req.files.list.tempFilePath,
          { schema }
        );
        if (errors.length > 0) {
          const err =
            "Pastors List has error(s), check the excel file header (PASTOR NAMES)";
          return onError(res, 400, err);
        }
        if (rows.length > 0) {
          for (let i = 0; i <= rows.length - 1; i++) {
            const nbr =
              Math.floor(Math.random() * (99999999999 - 10000 + 1)) + 10000;
            const data = [nbr, rows[i].names];
            fileRows.push(data);
            await pastorsModel.uploadPastors(data);
          }
          fs.unlink(req.files.list.tempFilePath, (err) => {
            if (err) {
              console.log("error occured");
            }
          });
          return onSuccess(
            res,
            201,
            "Pastors list successfully uploaded",
            fileRows
          );
        }
      }
      return onError(res, 403, "Access denied!, Only Admin and Union allowed");
    } catch (err) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  static async uploadChurches(req, res) {
    try {
      const { role } = req.user;
      if (role === "union" || role === "admin") {
        if (!req.files) return onError(res, 400, "No file selected");
        if (!req.files.churches) return onError(res, 400, "No file selected");
        const arr = req.files.churches.name.split(".");
        const lastIndex = arr.length - 1;
        const extension = arr[lastIndex];
        if (extension !== "xlsx" && extension !== "xlsm")
          return onError(
            res,
            400,
            "File should be an excel with [xlsx or xlsm] extension"
          );
        const schema = {
          FIELD: {
            prop: "field",
            type: String,
            required: true,
          },
          ZONE: {
            prop: "zone",
            type: String,
            required: true,
          },
          DISTRICT: {
            prop: "district",
            type: String,
            required: true,
          },
          CHURCH: {
            prop: "church",
            type: String,
            required: true,
          },
          "PASTOR ID": {
            prop: "pastor",
            type: String,
            required: true,
          },
        };

        const { rows, errors } = await readXlsxFile(
          req.files.churches.tempFilePath,
          { schema }
        );
        if (errors.length > 0) {
          const err =
            "Churches List has error(s), check the excel file headers (FIELD, ZONE, DISTRICT, CHURCH, PASTOR ID)";
          return onError(res, 400, err);
        }
        if (rows.length > 0) {
          const fileRows = [];
          for (let i = 0; i <= rows.length - 1; i++) {
            const data = [
              rows[i].pastor,
              rows[i].field,
              rows[i].zone,
              rows[i].district,
              rows[i].church,
            ];
            fileRows.push(data);
            await pastorsModel.addChurch(data);
          }
          fs.unlink(req.files.churches.tempFilePath, (err) => {
            if (err) {
              console.log("error occured");
            }
          });
          return onSuccess(
            res,
            201,
            "Churches list successfully uploaded",
            fileRows
          );
        }
      }
      return onError(res, 403, "Access denied!, Only Admin and Union allowed");
    } catch (err) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  static async addSinglePastor(req, res) {
    try {
      const { role } = req.user;
      if (role === "union" || role === "admin") {
        if (!req.body.pastor_names)
          return onError(res, 400, "Enter the pastor names please");
        const nbr =
          Math.floor(Math.random() * (99999999999 - 10000 + 1)) + 10000;
        const values = [nbr, req.body.pastor_names];
        const result = await pastorsModel.addPastor(values);
        return onSuccess(res, 201, "Pastors successfully added", result);
      }
      return onError(res, 403, "Aceess denied!, Only Admin and Union allowed");
    } catch (err) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  static async addSingleChurch(req, res) {
    try {
      const { role } = req.user;
      if (role === "union" || role === "admin") {
        const { error } = validateChurch(req.body);
        if (error) {
          const err = error.details[0].message.split('"').join("");
          return onError(res, 400, err);
        }
        const { field, zone, district, church, pastor } = req.body;
        const values = [pastor, field, zone, district, church];

        const result = await pastorsModel.addChurch(values);
        return onSuccess(res, 201, "Church successfully added", result);
      }
      return onError(res, 403, "Aceess denied!, Only Admin and Union allowed");
    } catch (err) {
      console.log(err);
      return onError(res, 500, "Internal Server Error");
    }
  }
}
