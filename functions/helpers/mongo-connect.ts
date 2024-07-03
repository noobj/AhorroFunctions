/* eslint-disable require-jsdoc */
import { defineString } from "firebase-functions/params";

import mongoose from "mongoose";

const username = defineString("MONGO_USER");
const pass = defineString("MONGO_PASS");
const url = defineString("MONGO_URL");
const db = defineString("MONGO_DB");

export default async function main() {
    await mongoose.connect(
        `mongodb+srv://${username.value()}:${pass.value()}@${url.value()}/${db.value()}`,
    );
}
