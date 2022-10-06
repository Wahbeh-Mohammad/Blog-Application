const fetchCreateBlog = (body, token, callback) => {
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

export default fetchCreateBlog;
