const register = (body, callback) => {
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

export default register;
