import * as mongoose from "mongoose";
import { UserDocument } from "./user.model";
import { CategoryDocument } from "./category.model";

export interface Entry {
    amount: number;
    user: mongoose.PopulatedDoc<UserDocument>;
    category: mongoose.PopulatedDoc<CategoryDocument>;
    date: string;
    descr?: string;
}

export interface EntryDocument extends Entry, mongoose.Document {}

const entrySchema = new mongoose.Schema({
    amount: Number,
    date: String,
    descr: String,
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    category: {
        ref: "Category",
        type: mongoose.Schema.Types.ObjectId,
    },
});

const tmpEntryModel =
    Object.keys(mongoose.models).length === 0 ? mongoose.models?.Entry : null;

export default tmpEntryModel ?
    (mongoose.models.Entry as mongoose.Model<EntryDocument>) :
    mongoose.model<EntryDocument>("Entry", entrySchema);
