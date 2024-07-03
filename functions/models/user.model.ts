import * as mongoose from "mongoose";

interface User {
    account: string;
    password?: string;
    google_access_token?: string;
    google_refresh_token?: string;
}

export interface UserDocument extends User, mongoose.Document {}

const userSchema = new mongoose.Schema({
    account: { type: String, unique: true },
    password: { type: String, required: false },
    google_access_token: { type: String, required: false },
    google_refresh_token: { type: String, required: false },
});

const tmpUserModel =
    Object.keys(mongoose.models).length === 0 ? mongoose.models?.User : null;

const userModel = tmpUserModel ?
    (mongoose.models.User as mongoose.Model<UserDocument>) :
    mongoose.model<UserDocument>("User", userSchema);

export default userModel;
