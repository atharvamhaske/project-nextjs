import bcrypt from "bcryptjs";
import mongoose, {Schema, model, models} from "mongoose";

export interface IUSer {
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    _id?: mongoose.Types.ObjectId

};

const userSchema = new Schema<IUSer>({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {
    timestamps: true
});


userSchema.pre("save", async function (next){
    if(this.isModified('password')) {
      this.password =  await bcrypt.hash(this.password, 10)
    }
    next();
});

const User = models?.User || model<IUSer>("User", userSchema);

export default User;