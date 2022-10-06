const fetchUpdateUserBio = (token, body, callback) => {
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

export default fetchUpdateUserBio;
