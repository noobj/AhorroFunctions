import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import verifyUserFromJWT from "@/helpers/verify-user";
import EntryModel from "@/models/entry.model";

export const addRecord = onRequest(async (request, response) => {
    logger.info(".....Start Add Record.....", { structuredData: true });
    const { amount, date, category } = request.body;

    const user = await verifyUserFromJWT(request, response);
    if (!user) {
        response.status(401).send("please login again");
        return;
    }

    if (!amount || !date || !category) {
        response.status(400).json({ result: "Invalid params" });
        return;
    }

    try {
        const newEntry = new EntryModel({
            amount,
            date,
            user: user._id,
            category,
        });
        const doc = await newEntry.save();
        response.status(200).send(doc._id);
    } catch (e) {
        console.error("Error adding document: ", e);
        response.status(500).json({ result: "Failed adding entry" });
    }
});
