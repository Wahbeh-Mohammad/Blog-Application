import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Box, Divider, Typography, Button, Menu, MenuItem } from "@mui/material";
import Cookies from "universal-cookie";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import verifyToken from "../../utils/VerifyToken";
import "../../styles/partials/Header.css";

const Header = (props) => {
    const { theme, setTheme } = props;
    const cookies = new Cookies();
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogout = () => {
        setUsername("");
        setLoggedIn(false);
        cookies.remove("username");
        cookies.remove("token");
        cookies.remove("id");
        cookies.remove("name");
        window.location.assign("/");
    };

    // Menu Controls
    const [anchor, setAnchor] = useState(null);
    const menuOpen = Boolean(anchor);
    const [open, setOpen] = useState(false);

    const handleOpen = (e) => {
        setAnchor(e.currentTarget);
    };

    const handleClose = () => {
        setAnchor(null);
    };

    useEffect(() => {
        const cookies = new Cookies();
        const token = cookies.get("token");
        if (token) {
            verifyToken(token).then((status) => {
                if (status) {
                    setLoggedIn(true);
                    setUsername(cookies.get("name"));
                    setUserId(cookies.get("id"));
                } else {
                    setLoggedIn(false);
                    cookies.remove("id");
                    cookies.remove("name");
                    cookies.remove("username");
                    cookies.remove("token");
                }
            });
        }
    }, []);

    return (
        <>
            <Box className="header">
                <Link to="/" className="link">
                    <Typography sx={{ fontWeight: "bold" }} color="primary.dark" variant="h4" className="logo">
                        Weblog
                    </Typography>
                </Link>
                {loggedIn ? (
                    <>
                        <Box className="links">
                            <Link className="link" to="/feed">
                                <Typography sx={{ fontWeight: "bold" }} variant="h6" color="text.default">
                                    Feed
                                </Typography>
                            </Link>
                            <Link className="link" to="/blog/new">
                                <Typography sx={{ fontWeight: "bold" }} variant="h6" color="text.default">
                                    Create Blog
                                </Typography>
                            </Link>
                        </Box>
                        <Box className="theme-avatar">
                            <Avatar
                                className="avatar"
                                sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontSize: "16px" }}
                                onClick={handleOpen}
                            >
                                {username.split(" ").map((part) => part[0].toUpperCase())}
                            </Avatar>
                            <Menu onClose={handleClose} open={menuOpen} anchorEl={anchor}>
                                <MenuItem>
                                    <Link to={`/profile/${userId}`} className="link">
                                        <Typography className="icon-typography" color="text.default">
                                            <PersonIcon />
                                            Profile
                                        </Typography>
                                    </Link>
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                    <Typography className="icon-typography">
                                        <LogoutIcon />
                                        Logout
                                    </Typography>
                                </MenuItem>
                            </Menu>
                            {theme === "light" ? (
                                <DarkModeIcon color="primary" fontSize="large" sx={{ cursor: "pointer" }} onClick={() => setTheme("dark")} />
                            ) : (
                                <LightModeIcon color="primary" fontSize="large" sx={{ cursor: "pointer" }} onClick={() => setTheme("light")} />
                            )}
                        </Box>
                    </>
                ) : (
                    <Box className="links">
                        <Link className="link" to="/login">
                            <Typography sx={{ fontWeight: "bold" }} variant="h6" color="text.default">
                                Login
                            </Typography>
                        </Link>
                        <Link className="link" to="/register">
                            <Typography sx={{ fontWeight: "bold" }} variant="h6" color="text.default">
                                Register
                            </Typography>
                        </Link>
                        {theme === "light" ? (
                            <DarkModeIcon color="primary" fontSize="large" sx={{ cursor: "pointer" }} onClick={() => setTheme("dark")} />
                        ) : (
                            <LightModeIcon color="primary" fontSize="large" sx={{ cursor: "pointer" }} onClick={() => setTheme("light")} />
                        )}
                    </Box>
                )}
                <Box className="theme-burger">
                    {theme === "light" ? (
                        <DarkModeIcon color="primary" fontSize="large" sx={{ cursor: "pointer" }} onClick={() => setTheme("dark")} />
                    ) : (
                        <LightModeIcon color="primary" fontSize="large" sx={{ cursor: "pointer" }} onClick={() => setTheme("light")} />
                    )}
                    <Box className="burger" component="span" onClick={() => setOpen(!open)}>
                        <Box className="slice" sx={{ bgcolor: "primary.main" }}></Box>
                        <Box className="slice" sx={{ bgcolor: "primary.main" }}></Box>
                        <Box className="slice" sx={{ bgcolor: "primary.main" }}></Box>
                    </Box>
                </Box>
            </Box>
            {loggedIn ? (
                <>
                    <Box className={open ? "res-links" : "hidden"} sx={{ bgcolor: "background.default" }}>
                        <Link className="link" to="/feed" onClick={() => setOpen(false)}>
                            <Typography variant="h6" color="text.default" sx={{ fontWeight: "bold" }}>
                                Feed
                            </Typography>
                        </Link>
                        <Divider />
                        <Link className="link" to="/blog/new" onClick={() => setOpen(false)}>
                            <Typography variant="h6" color="text.default" sx={{ fontWeight: "bold" }}>
                                Create Blog
                            </Typography>
                        </Link>
                        <Divider />
                        <Link className={open ? "link" : "hidden"} to={`/profile/${userId}`} onClick={() => setOpen(false)}>
                            <Typography variant="h6" color="text.default" sx={{ fontWeight: "bold" }}>
                                Profile
                            </Typography>
                        </Link>
                        <Divider />
                        <Button
                            className={open ? "link" : "hidden"}
                            variant="text"
                            sx={{ color: "text.default", fontWeight: "bold" }}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                        <Divider />
                    </Box>
                </>
            ) : (
                <Box className={open ? "res-links" : "hidden"} sx={{ bgcolor: "background.default" }}>
                    <Link className={open ? "link" : "hidden"} to="/login" onClick={() => setOpen(false)}>
                        <Typography variant="h6" color="text.default" sx={{ fontWeight: "bold" }}>
                            Login
                        </Typography>
                    </Link>
                    <Divider />
                    <Link className={open ? "link" : "hidden"} to="/register" onClick={() => setOpen(false)}>
                        <Typography variant="h6" color="text.default" sx={{ fontWeight: "bold" }}>
                            Register
                        </Typography>
                    </Link>
                    <Divider />
                </Box>
            )}
        </>
    );
};

export default Header;
