type validationFunction = (value: string) => boolean;

// User validations
const isValidName: validationFunction = (name: string): boolean => {
    return name !== undefined && name.length >= 3 && name.includes(" ");
};

const isValidUsername: validationFunction = (username: string): boolean => {
    return username !== undefined && username !== null && username.length >= 5;
};

const isValidPassword: validationFunction = (password: string): boolean => {
    return password !== undefined && password !== null && password.length >= 8;
};

// Blog Validations
const isValidBlogTitle: validationFunction = (blogTitle: string): boolean => {
    return blogTitle !== undefined && blogTitle !== null && blogTitle.length >= 4;
};

const isValidBlogContent: validationFunction = (blogContent: string): boolean => {
    return blogContent !== undefined && blogContent !== null && blogContent.length >= 10;
};

export default {
    isValidUsername,
    isValidPassword,
    isValidName,
    isValidBlogTitle,
    isValidBlogContent,
};
