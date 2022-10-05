import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { Blog } from "../components";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import "../styles/Profile.css";

const Profile = (props) => {
    // View controls
    const [currentView, setCurrentView] = useState("details");

    // Profile Data related
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState("");

    const [biography, setBiography] = useState("");
    const [biographyError, setBiographyError] = useState(false);

    const handleChangeBiography = () => {
        const cookies = new Cookies();

        fetch(`${process.env.REACT_APP_API_URL}/user/bio`, {
            method: "POST",
            headers: {
                authorization: cookies.get("token"),
                "content-type": "application/json",
            },
            body: JSON.stringify({ biography }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    alert("Biography Updated successfuly");
                } else {
                    alert(data.error);
                }
            });
    };

    // blogs related
    const [blogs, setBlogs] = useState(null);
    const deleteBlog = (idx) => {
        setBlogs((blogs) => blogs.filter((_, index) => index !== idx));
    };

    // Saved blogs related
    const [savedBlogs, setSavedBlogs] = useState(null);

    useEffect(() => {
        const cookies = new Cookies();
        const token = cookies.get("token");

        if (!token) return setError("User not logged in.");

        fetch(`${process.env.REACT_APP_API_URL}/user/`, {
            method: "GET",
            headers: {
                authorization: token,
            },
        })
            .then((res) => res.json())
            .then(({ status, data, error }) => {
                if (status) {
                    data.token = token;
                    data.userId = cookies.get("id");
                    setProfileData(data);
                } else {
                    setError(error);
                }
            });

        fetch(`${process.env.REACT_APP_API_URL}/blog/user/`, {
            method: "GET",
            headers: {
                authorization: token,
            },
        })
            .then((res) => res.json())
            .then(({ status, data, error }) => {
                if (status) {
                    setBlogs(data);
                } else {
                    alert(error);
                }
            });

        fetch(`${process.env.REACT_APP_API_URL}/savedBlog/user/full`, {
            method: "GET",
            headers: {
                authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                if (data.status) setSavedBlogs(data.data);
                else setSavedBlogs(null);
            });
    }, []);

    return (
        <Box className="profile-wrapper">
            {profileData !== null && (
                <Box className="profile">
                    <Box className="profile-header">
                        <Box className="profile-header-left">
                            <Box className="name-box" sx={{ height: "75px", width: "75px", bgcolor: "primary.dark" }}>
                                <Typography variant="h4">{profileData.name.split(" ").map((part) => part[0].toUpperCase())}</Typography>
                            </Box>
                            <Typography color="text.default" variant="h4">
                                {profileData.name}
                            </Typography>
                        </Box>
                        <Box className="profile-header-right">
                            <Button
                                sx={{ fontWeight: "bold" }}
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    setCurrentView("details");
                                }}
                            >
                                My Details
                            </Button>
                            <Button
                                sx={{ fontWeight: "bold" }}
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    setCurrentView("blogs");
                                }}
                            >
                                My Blogs
                            </Button>
                            <Button
                                sx={{ fontWeight: "bold" }}
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    setCurrentView("saved-blogs");
                                }}
                            >
                                My Saved Blogs
                            </Button>
                        </Box>
                    </Box>
                    <Divider />
                    <Box className="main-profile-content">
                        {currentView === "details" && (
                            <Box className="profile-details">
                                <Box className="profile-details-left">
                                    <Box className="profile-details-segment">
                                        <Typography variant="h6" color="text.default">
                                            Real name
                                        </Typography>
                                        <TextField variant="outlined" value={profileData.name} color="primary" disabled />
                                    </Box>
                                    <Box className="profile-details-segment">
                                        <Typography variant="h6" color="text.default">
                                            Username
                                        </Typography>
                                        <TextField variant="outlined" value={profileData.username} color="primary" disabled />
                                    </Box>
                                    <Box className="profile-details-segment">
                                        <Typography variant="h6" color="text.default">
                                            Password
                                        </Typography>
                                        <TextField variant="outlined" value={profileData.password} type="password" color="primary" disabled />
                                    </Box>
                                    <Box className="profile-details-segment">
                                        <Typography variant="h6" color="text.default">
                                            Gender
                                        </Typography>
                                        <TextField variant="outlined" value={profileData.gender} type="text" color="primary" disabled />
                                    </Box>
                                    <Box className="profile-details-segment">
                                        <Typography variant="h6" color="text.default">
                                            Birthdate
                                        </Typography>
                                        <TextField variant="outlined" value={profileData.birthdate} type="text" color="primary" disabled />
                                    </Box>
                                </Box>
                                <Box className="profile-details-right">
                                    <Typography variant="h6" color="text.default">
                                        Biography
                                    </Typography>
                                    <TextField
                                        multiline
                                        rows={10}
                                        fullWidth
                                        label="Biography"
                                        placeholder="Tell us about yourself"
                                        value={biography}
                                        onChange={(e) => setBiography(e.target.value)}
                                        error={biographyError}
                                    />
                                    <Button variant="contained" sx={{ fontWeight: "Bold" }} onClick={handleChangeBiography}>
                                        Save Biography
                                    </Button>
                                </Box>
                            </Box>
                        )}
                        {currentView === "blogs" && (
                            <Box className="blog-list">
                                {blogs.map((blog, idx) => {
                                    return <Blog key={blog._id} idx={idx} onDelete={deleteBlog} userDetails={profileData} blog={blog} />;
                                })}
                            </Box>
                        )}
                        {currentView === "saved-blogs" && (
                            <Box className="blog-list">
                                {savedBlogs.map((savedBlog, idx) => {
                                    const { blogId, userId } = savedBlog;
                                    const blog = blogId;
                                    blog.createdBy = userId;
                                    return <Blog key={blog._id} idx={idx} onDelete={deleteBlog} userDetails={profileData} blog={blog} />;
                                })}
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
            {profileData === false && error && (
                <Box className="error-box">
                    <Typography variant="h6">{error}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default Profile;
