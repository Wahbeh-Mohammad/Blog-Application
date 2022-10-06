const fetchSavedBlogs = (token, callback) => {
    fetch(`${process.env.REACT_APP_API_URL}/savedBlog/user`, {
        method: "GET",
        headers: {
            authorization: token,
        },
    })
        .then((res) => res.json())
        .then((data) => callback(data));
};

export default fetchSavedBlogs;
