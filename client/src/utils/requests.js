// User related
export const verifyTokenRequest = async (token) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/token`, {
        method: "GET",
        headers: {
            authorization: token,
        },
    });
    const data = await response.json();
    return data.status;
};

export const registerRequest = (body, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/user/register`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

export const loginRequest = (body, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

export const fetchUserDetails = (token, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/user/`, {
        method: "GET",
        headers: {
            authorization: token,
        },
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

export const fetchUpdateUserBio = (token, body, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/user/bio`, {
        method: "POST",
        headers: {
            authorization: token,
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

// Blogs related
export const fetchAllBlogs = (token, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/blog/`, {
        method: "GET",
        headers: {
            authorization: token,
        },
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

export const fetchCreateBlog = (body, token, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/blog/new`, {
        method: "POST",
        headers: {
            authorization: token,
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((error) => console.log(error));
};

export const fetchDeleteBlog = (token, id, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/blog/${id}`, {
        method: "DELETE",
        headers: {
            authorization: token,
        },
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

export const fetchSpecificBlog = (token, id, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/blog/specific/${id}`, {
        method: "GET",
        headers: {
            authorization: token,
        },
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

export const fetchUpdateBlogDetails = (token, id, body, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/blog/${id}`, {
        method: "PUT",
        headers: {
            authorization: token,
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

export const fetchUserBlogs = (token, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/blog/user/`, {
        method: "GET",
        headers: {
            authorization: token,
        },
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

// Saved blogs related
export const fetchSavedBlogs = (token, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/savedBlog/user`, {
        method: "GET",
        headers: {
            authorization: token,
        },
    })
        .then((res) => res.json())
        .then((data) => callback(data));
};

export const fetchFullSavedBlogs = (token, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/savedBlog/user/full`, {
        method: "GET",
        headers: {
            authorization: token,
        },
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

export const fetchSaveCheck = (token, id, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/savedBlog/${id}`, {
        method: "GET",
        headers: {
            authorization: token,
        },
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

export const fetchSaveBlog = (token, id, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/savedBlog/${id}`, {
        method: "POST",
        headers: {
            authorization: token,
        },
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

export const fetchUnsaveBlog = (token, id, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/savedBlog/${id}`, {
        method: "DELETE",
        headers: {
            authorization: token,
        },
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

// Comment related
export const fetchCreateComment = (token, body, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/comment/new`, {
        method: "POST",
        headers: {
            authorization: token,
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};

export const fetchUpdateComment = (token, id, body, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/comment/${id}`, {
        method: "PUT",
        headers: {
            authorization: token,
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err));
};
