const fetchSaveCheck = (token, id, callback) => {
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

export default fetchSaveCheck;
