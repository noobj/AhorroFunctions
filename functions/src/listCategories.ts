import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import CategoryModel from "@/models/category.model";
import verifyUserFromJWT from "@/helpers/verify-user";

export const listCategories = onRequest(async (request, response) => {
    logger.info(".....Start list categories.....", { structuredData: true });

    try {
        const user = await verifyUserFromJWT(request, response);
        if (!user) {
            response.status(401).send("please login again");
            return;
        }

        const categories = await CategoryModel.find({ user: user._id });
        response.status(200).json(categories);
    } catch (e) {
        console.error("Error adding document: ", e);
        response.status(500).json({ result: "Failed adding entry" });
    }
});
