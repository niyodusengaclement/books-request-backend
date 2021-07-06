import pastorsModel from "../model/pastorsModel";
import { onError, onSuccess } from "../utils/response";

export default class GuestController {
  static async findFields(req, res) {
    try {
      const data = await pastorsModel.findAllFields();
      return onSuccess(res, 200, "Retrieved sussessfully", data);
    } catch (err) {
      console.log(err);
      return onError(res, 500, "Internal Server Error");
    }
  }

  static async findDistricts(req, res) {
    try {
      let { field } = req.query;
      field = field ? field.toUpperCase() : "";
      const ditricts = await pastorsModel.findDistricts(field);
      return onSuccess(res, 200, "Retrieved sussessfully", ditricts);
    } catch (err) {
      console.log(err);
      return onError(res, 500, "Internal Server Error");
    }
  }

  static async findChurches(req, res) {
    try {
      const { pastorCode } = req.query;
      const churches = await pastorsModel.findChurchesPerPastor(pastorCode);
      return onSuccess(res, 200, "Retrieved sussessfully", churches);
    } catch (err) {
      console.log(err);
      return onError(res, 500, "Internal Server Error");
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
        const { bookid, church_id, request, pastor_code: id_code } = req.body;
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
      const { command, church, year, term, category } = req.body;

      const body = [id_code, church, command, year, term, category];
      const output = await pastorsModel.createCommand(body);
      if (output)
        return onSuccess(res, 201, "Request successfully sent", output);
    } catch (err) {
      console.log(err);
      return onError(res, 500, "Internal Server error");
    }
  }
}
