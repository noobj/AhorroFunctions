import * as cookie from "cookie";
import * as jwt from "jsonwebtoken";
import { defineString } from "firebase-functions/params";
import { type JwtPayload, TokenExpiredError } from "jsonwebtoken";
import UserModel from "@/models/user.model";
import { Request, Response } from "express";

const secret = defineString("ACCESS_TOKEN_SECRET");

// eslint-disable-next-line require-jsdoc
export default async function main(request: Request, response: Response) {
    const cookies = cookie.parse(request.headers.cookie || "");
    try {
        const decodedToken = <JwtPayload>(
            jwt.verify(cookies.access_token, secret.value())
        );

        const user = await UserModel.findById(decodedToken?.payload);

        return user;
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            response.status(401).json({ result: "please login again" });
            return;
        }

        throw e;
    }
}
