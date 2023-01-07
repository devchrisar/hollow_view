import Mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  _id?: string;
  username: string;
  password: string;
  name: string;
}

const UserSchema = new Mongoose.Schema({
  id: { type: Object },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
});

UserSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    const document = this;

    bcrypt.hash(document.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      document.password = hashedPassword;
      next();
    });
  } else {
    next();
  }
});

UserSchema.methods.usernameExists = async function (
  username: any
): Promise<boolean> {
  let result = await Mongoose.model("User").find({ username: username });
  return result.length > 0;
};

UserSchema.methods.isCorrectPassword = async function (
  password: string | Buffer,
  hashedPassword: string
): Promise<boolean> {
  console.log(password, hashedPassword);
  const same = await bcrypt.compare(password, hashedPassword);
  return same;
};

export default Mongoose.model<any>("User", UserSchema);
