const fetchFullSavedBlogs = (token, callback) => {
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

export default fetchFullSavedBlogs;
