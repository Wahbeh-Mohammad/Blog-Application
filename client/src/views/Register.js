import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, TextField, Button, Paper, Divider, FormControlLabel, FormControl, Radio, RadioGroup, FormLabel } from "@mui/material";
import Cookies from "universal-cookie";
import verifyToken from "../utils/VerifyToken";
import HomeIcon from "@mui/icons-material/Home";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import "../styles/Forms.css";

const getCurrentDate = () => {
    let today = new Date();
    today.setFullYear(today.getFullYear() - 5);
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
};

const Register = (props) => {
    const { theme, setTheme } = props;
    const cookies = new Cookies();
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [realName, setRealName] = useState("");
    const [realNameError, setRealNameError] = useState(false);
    const [birthdate, setBirthdate] = useState(getCurrentDate());
    const [birthdateError, setBirthdateError] = useState(false);
    const [gender, setGender] = useState("Male");

    const [formError, setFormError] = useState("");

    const resetErrors = () => {
        setUsernameError(false);
        setPasswordError(false);
        setConfirmPasswordError(false);
        setRealNameError(false);
        setBirthdateError(false);
        setFormError("");
    };

    const handleRegister = () => {
        resetErrors();

        if (!username) return setUsernameError(true);
        if (!password) return setPasswordError(true);
        if (password !== confirmPassword) return setConfirmPasswordError(true);
        if (!birthdate) return setBirthdateError(true);
        if (!realName) return setRealNameError(true);

        fetch(`${process.env.REACT_APP_API_URL}/user/register`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ username, password, birthdate, gender, name: realName }),
        })
            .then((response) => response.json())
            .then((data) => {
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
            verifyToken(token).then((status) => {
                if (status) {
                    window.location.assign("/");
                } else {
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
                <Paper className="form" elevation={5}>
                    <Typography className="form-title" variant="h4" sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
                        Register
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
                            fullWidth
                        />
                        <Box className="form-group">
                            <TextField
                                autoComplete="off"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={passwordError}
                                label="Password"
                                fullWidth
                            />
                            <TextField
                                autoComplete="off"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={confirmPasswordError}
                                label="Confirm Password"
                                fullWidth
                            />
                        </Box>
                        <TextField
                            autoComplete="off"
                            type="text"
                            label="Real name"
                            value={realName}
                            error={realNameError}
                            onChange={(e) => setRealName(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            autoComplete="off"
                            type="date"
                            label="Birthdate"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            error={birthdateError}
                            fullWidth
                            color="primary"
                        />
                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    <Divider />
                    <Box className="form-actions">
                        <Button variant="contained" onClick={handleRegister}>
                            Submit
                        </Button>
                        <Link to="/login" className="link">
                            <Button color="primary" variant="outlined">
                                Login
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

export default Register;
