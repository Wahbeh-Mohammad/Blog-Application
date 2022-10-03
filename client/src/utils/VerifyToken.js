const verifyToken = async (token) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/token`, {
        method: "GET",
        headers: {
            authorization: token,
        },
    });
    const data = await response.json();
    return data.status;
};

export default verifyToken;
