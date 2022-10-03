import bcryptjs from "bcryptjs";

const hashPassword = (password: string) => {
    const salt = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(password, salt);
};

const comparePasswords = (incomingPassword: string, storedPassword: string) => {
    return bcryptjs.compareSync(incomingPassword, storedPassword);
};

export default {
    hashPassword,
    comparePasswords,
};
