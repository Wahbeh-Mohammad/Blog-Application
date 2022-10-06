const fetchUpdateBlogDetails = (token, id, body, callback) => {
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

export default fetchUpdateBlogDetails;
