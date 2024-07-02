import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import mongoConnect from "@/helpers/mongo-connect";
import CategoryModel from "@/models/category.model";

export const addRecord = onRequest(async (request, response) => {
  logger.info(".....Start Add Record.....", {structuredData: true});
  const {amount, date, category, user} = request.body;

  if (!amount || !date || !category || !user) {
    response.status(401).json({result: "Invalid params"});
    return;
  }

  try {
    await mongoConnect();
    const newCategory = new CategoryModel({
      name: "123",
      color: "12345",
      user: "627106d67b2f25ddd3daf964",
    });
    const doc = await newCategory.save();
    response.status(200).send(doc._id);
  } catch (e) {
    console.error("Error adding document: ", e);
    response.status(500).json({result: "Failed adding entry"});
  }
});
