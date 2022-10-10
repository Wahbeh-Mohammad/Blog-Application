import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, Typography, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Paper } from "@mui/material";
import Cookies from "universal-cookie";
import { Blog, SavedBlog, Toast } from "../components";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "../styles/Feed.css";
import { fetchAllBlogs, fetchSavedBlogs } from "../utils/requests";

const Feed = (props) => {
    const cookies = useMemo(() => new Cookies(), []);
    const token = cookies.get("token");

    // Toast Controls
    const [toastOpen, setToastOpen] = useState(false);
    const [toastContent, setToastContent] = useState("");
    const [toastSeverity, setToastSeverity] = useState("");

    const handleToastClose = (event, reason) => {
        if (reason === "clickaway") return;
        setToastOpen(false);
        setToastContent("");
        setToastSeverity("");
    };

    const [userDetails, setUserDetails] = useState({});
    const [blogs, setBlogs] = useState([]);

    const deleteBlog = (idx) => setBlogs((blogs) => blogs.filter((_, index) => index !== idx));

    // Filter related
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterTitle, setFilterTitle] = useState("");
    const [filterType, setFilterType] = useState("Any");

    // Saved Blogs
    const [savedBlogs, setSavedBlogs] = useState([]);
    const afterSaveUnsaveOperation = () =>
        fetchSavedBlogs(token, (data) => {
            if (data.data.length !== 0) setSavedBlogs(data.data);
            else setSavedBlogs(null);
        });

    useEffect(() => {
        if (!token) {
            setToastContent("User not logged in.");
            setToastSeverity("error");
            setToastOpen(true);
            return;
        }

        fetchAllBlogs(token, (data) => {
            if (data.status) {
                setBlogs(data.data);
                setUserDetails({
                    username: cookies.get("username"),
                    name: cookies.get("name"),
                    userId: cookies.get("id"),
                    token: cookies.get("token"),
                });
            } else {
                setToastContent(data.error);
                setToastSeverity("error");
                setToastOpen(true);
            }
        });

        fetchSavedBlogs(token, (data) => {
            if (data.data.length !== 0) setSavedBlogs(data.data);
            else setSavedBlogs(null);
        });
    }, [token, cookies]);

    return (
        <Box className="feed">
            <Box className="filter">
                <Box className="flex-row centered filter-top">
                    <Typography className="icon-typography" variant="h4" color="primary.dark">
                        <FilterAltIcon fontSize="large" />
                        Filter
                    </Typography>
                    <KeyboardArrowDownIcon
                        onClick={() => setFilterOpen(!filterOpen)}
                        className={filterOpen ? "more-filter rotated" : "more-filter"}
                        color="primary"
                        fontSize="large"
                        sx={{ cursor: "pointer" }}
                    />
                </Box>
                <Box className={`filter-block-wrapper ${filterOpen ? "filter-item" : "filter-item-hidden"} flex-row centered`}>
                    <TextField
                        onChange={(e) => {
                            setFilterTitle(e.target.value.toLowerCase());
                        }}
                        label="Blog Title"
                        size="small"
                        variant="outlined"
                        color="primary"
                    />
                </Box>
                <Box className={`filter-block-wrapper ${filterOpen ? "filter-item" : "filter-item-hidden"} filter-item`}>
                    <FormControl>
                        <FormLabel color="primary" sx={{ fontWeight: "bold" }} id="filter-blog-type">
                            Blog Type
                        </FormLabel>
                        <RadioGroup
                            className="filter-select"
                            default="Any"
                            name="filter-blog-type"
                            aria-labelledby="filter-blog-type"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            {["Any", "Learning", "Devlog", "Topics", "Misc"].map((value) => {
                                return (
                                    <FormControlLabel
                                        key={value}
                                        value={value}
                                        control={<Radio color="primary" />}
                                        label={<Typography color="text.default">{value}</Typography>}
                                    />
                                );
                            })}
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Box>
            <Box className="blog-list">
                {blogs
                    .filter((blog) => blog.blogTitle.toLowerCase().includes(filterTitle) && (filterType === "Any" || blog.blogType === filterType))
                    .map((blog, idx) => {
                        return (
                            <Blog
                                key={blog._id}
                                idx={idx}
                                onDelete={deleteBlog}
                                afterSaveUnsaveOperation={afterSaveUnsaveOperation}
                                userDetails={userDetails}
                                blog={blog}
                            />
                        );
                    })}
            </Box>
            <Box className="saved-blogs">
                <Paper elevation={5} className="saved-blogs-actions">
                    <Typography color="primary.dark" variant="h6" className="icon-typography">
                        <BookmarkIcon />
                        Saved Blogs
                    </Typography>
                </Paper>
                {savedBlogs === null ? (
                    <Box className="no-save-wrapper">
                        <Typography variant="h4" color="primary.dark" className="no-save">
                            You haven't Saved any blogs yet.
                        </Typography>
                    </Box>
                ) : (
                    savedBlogs.map((blog) => {
                        return <SavedBlog key={blog._id} userDetails={userDetails} blog={blog} />;
                    })
                )}
            </Box>
            <Toast open={toastOpen} toastContent={toastContent} onClose={handleToastClose} severity={toastSeverity} />
        </Box>
    );
};

export default Feed;
