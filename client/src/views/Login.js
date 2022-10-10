import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import HomeIcon from "@mui/icons-material/Home";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { verifyTokenRequest, loginRequest } from "../utils/requests";
import { Box, Button, Paper, Typography, Divider, TextField } from "@mui/material";
import "../styles/Forms.css";

const Login = (props) => {
    const { theme, setTheme } = props;
    const cookies = new Cookies();
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [formError, setFormError] = useState("");

    const resetErrors = () => {
        setUsernameError(false);
        setPasswordError(false);
        setFormError("");
    };

    const handleLogin = () => {
        resetErrors();
        if (!username) return setUsernameError(true);
        if (!password) return setPasswordError(true);

        loginRequest({ username, password }, (data) => {
            if (data.status) {
                cookies.set("username", data.username);
                cookies.set("id", data.id);
                cookies.set("token", data.token);
                cookies.set("name", data.name);
                window.location.assign("/");
            } else {
                setFormError(data.error);
            }
        });
    };

    useEffect(() => {
        const cookies = new Cookies();
        const token = cookies.get("token");
        if (token) {
            verifyTokenRequest(token).then((status) => {
                if (status) window.location.assign("/");
                else {
                    cookies.remove("id");
                    cookies.remove("username");
                    cookies.remove("token");
                    cookies.remove("name");
                }
            });
        }
    }, []);

    return (
        <Box className="form-wrapper" sx={{ bgcolor: "background.default" }}>
            <Box className="form-theme-controls">
                <Link to="/" className="link">
                    <HomeIcon sx={{ cursor: "pointer" }} color="primary" fontSize="large" />
                </Link>
                {theme === "light" ? (
                    <DarkModeIcon color="primary" fontSize="large" sx={{ cursor: "pointer" }} onClick={() => setTheme("dark")} />
                ) : (
                    <LightModeIcon color="primary" fontSize="large" sx={{ cursor: "pointer" }} onClick={() => setTheme("light")} />
                )}
            </Box>
            <Box className="center-component-within">
                <Paper elevation={5} className="form">
                    <Typography className="form-title" variant="h4" sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
                        Login
                    </Typography>
                    <Divider />
                    <Box className="form-inputs">
                        <TextField
                            autoComplete="off"
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={usernameError}
                        />
                        <TextField
                            autoComplete="off"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={passwordError}
                        />
                    </Box>
                    <Divider />
                    <Box className="form-actions">
                        <Button variant="contained" onClick={handleLogin}>
                            Submit
                        </Button>
                        <Link to="/register" className="link">
                            <Button color="primary" variant="outlined">
                                Register
                            </Button>
                        </Link>
                        {formError && (
                            <Typography variant="subtitle1" color="red">
                                {formError}
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Login;
