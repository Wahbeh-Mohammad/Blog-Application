import React, { useState, useEffect, useMemo } from "react";
import Cookies from "universal-cookie";
import { Blog, Toast } from "../components";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import "../styles/Profile.css";
import { fetchFullSavedBlogs, fetchUserBlogs, fetchUserDetails } from "../requests";
import fetchUpdateUserBio from "../requests/user/FetchUpdateUserBio";

const Profile = (props) => {
    const cookies = useMemo(() => new Cookies(), []);
    const token = cookies.get("token");

    // Profile Data related
    const [profileData, setProfileData] = useState(null);
    const [biography, setBiography] = useState("");
    const [biographyError, setBiographyError] = useState(false);

    const handleChangeBiography = () => {
        setBiographyError(false);
        if (!biography.trim()) return setBiographyError(true);

        fetchUpdateUserBio(token, { biography: biography.trim() }, (data) => {
            setToastOpen(true);
            if (data.status) {
                setToastContent("Biography updated successfuly");
                setToastSeverity("success");
            } else {
                setToastContent(data.error);
                setToastSeverity("error");
            }
        });
    };

    // blogs related
    const [blogs, setBlogs] = useState(null);
    const deleteBlog = (idx) => setBlogs((blogs) => blogs.filter((_, index) => index !== idx));
    const [savedBlogs, setSavedBlogs] = useState(null);
    const afterSaveUnsaveOperation = () =>
        fetchFullSavedBlogs(token, (data) => {
            if (data.status) setSavedBlogs(data.data);
            else setSavedBlogs(null);
        });

    // View controls
    const [currentView, setCurrentView] = useState("details");

    useEffect(() => {
        if (!token) {
            setToastContent("User is not logged in");
            setToastSeverity("error");
            setToastOpen(true);
            return;
        }

        fetchUserDetails(token, ({ status, data, error }) => {
            if (status) {
                data.token = token;
                data.userId = cookies.get("id");
                setProfileData(data);
                setBiography(data.biography);
            } else {
                setToastOpen(true);
                setToastContent(error);
                setToastSeverity("error");
            }
        });

        fetchUserBlogs(token, ({ status, data, error }) => {
            if (status) {
                setBlogs(data);
            } else {
                setToastOpen(true);
                setToastContent(error);
                setToastSeverity("error");
            }
        });

        fetchFullSavedBlogs(token, (data) => {
            if (data.status) setSavedBlogs(data.data);
            else setSavedBlogs(null);
        });
    }, [token, cookies]);

    // Toast Controls
    const [toastOpen, setToastOpen] = useState(false);
    const [toastSeverity, setToastSeverity] = useState("");
    const [toastContent, setToastContent] = useState("");

    const handleToastClose = (event, reason) => {
        if (reason === "clickaway") return;
        setToastOpen(false);
        setToastSeverity("");
        setToastContent("");
    };

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
                                    {[
                                        ["Real name", "text", profileData.name],
                                        ["Username", "text", profileData.username],
                                        ["Password", "password", profileData.password],
                                        ["Gender", "text", profileData.gender],
                                        ["Birthdate", "date", profileData.birthdate],
                                    ].map((value) => {
                                        return (
                                            <Box key={value[0]} className="profile-details-segment">
                                                <Typography variant="h6" color="text.default">
                                                    {value[0]}
                                                </Typography>
                                                <TextField variant="outlined" value={value[2]} type={value[1]} color="primary" disabled />
                                            </Box>
                                        );
                                    })}
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
                                {blogs !== null &&
                                    blogs.map((blog, idx) => {
                                        return (
                                            <Blog
                                                afterSaveUnsaveOperation={afterSaveUnsaveOperation}
                                                key={blog._id}
                                                idx={idx}
                                                onDelete={deleteBlog}
                                                userDetails={profileData}
                                                blog={blog}
                                            />
                                        );
                                    })}
                            </Box>
                        )}
                        {currentView === "saved-blogs" && (
                            <Box className="blog-list">
                                {savedBlogs !== null &&
                                    savedBlogs.map((savedBlog, idx) => {
                                        const { blogId, userId } = savedBlog;
                                        const blog = blogId;
                                        blog.createdBy = userId;
                                        return (
                                            <Blog
                                                afterSaveUnsaveOperation={afterSaveUnsaveOperation}
                                                key={blog._id}
                                                idx={idx}
                                                onDelete={deleteBlog}
                                                userDetails={profileData}
                                                blog={blog}
                                            />
                                        );
                                    })}
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
            <Toast open={toastOpen} onClose={handleToastClose} severity={toastSeverity} toastContent={toastContent} />
        </Box>
    );
};

export default Profile;
