import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import "../styles/Home.css";
import Cookies from "universal-cookie";
import verifyToken from "../utils/VerifyToken";

const Home = (props) => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const cookies = new Cookies();
        const token = cookies.get("token");
        if (token) {
            verifyToken(token).then((status) => {
                if (status) {
                    setLoggedIn(true);
                } else {
                    setLoggedIn(false);
                    cookies.remove("id");
                    cookies.remove("username");
                    cookies.remove("name");
                    cookies.remove("token");
                }
            });
        }
    }, []);

    return (
        <Box className="home">
            <Box className="landing-text">
                <Typography variant="h3" gutterBottom color="primary.dark">
                    Hello and welcome to Weblog!
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ whiteSpace: "pre-line" }} color="primary.dark">
                    {"Read, Learn, Write and repeat!\nJoin now and start blogging your Software Development Engineering Journey!"}
                </Typography>
                <Box className="link-box">
                    {loggedIn ? (
                        <Link to="/feed" className="link">
                            <Button size="small" sx={{ fontWeight: "bold" }} variant="contained">
                                Go to feed
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="link">
                                <Button size="small" sx={{ fontWeight: "bold" }} variant="contained">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/register" className="link">
                                <Button size="small" sx={{ fontWeight: "bold" }} variant="contained">
                                    Register
                                </Button>
                            </Link>{" "}
                        </>
                    )}
                </Box>
            </Box>
            <img src="./images/homeHero.svg" className="home-hero" alt="Blogging" />
        </Box>
    );
};

export default Home;
