import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Button, Paper } from "@mui/material";
import Cookies from "universal-cookie";
import { Blog, SavedBlog } from "../components";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "../styles/Feed.css";

const Feed = (props) => {
    const [userDetails, setUserDetails] = useState({});
    const [blogs, setBlogs] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);

    const deleteBlog = (idx) => {
        setBlogs((blogs) => blogs.filter((_, index) => index !== idx));
    };

    // Filter related
    const [filterTitle, setFilterTitle] = useState("");
    const [filterType, setFilterType] = useState("Any");

    useEffect(() => {
        try {
            const cookies = new Cookies();
            const token = cookies.get("token");
            if (!token) return;
            fetch(`${process.env.REACT_APP_API_URL}/blog/`, {
                method: "GET",
                headers: {
                    authorization: token,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status) {
                        setBlogs(data.data);
                        const token = cookies.get("token");
                        const username = cookies.get("username");
                        const name = cookies.get("name");
                        const userId = cookies.get("id");
                        setUserDetails({ username, name, userId, token });
                    } else {
                        console.log(data.error);
                    }
                });
        } catch (err) {
            console.log(err);
        }
    }, []);

    // Saved Blogs
    const [savedBlogs, setSavedBlogs] = useState([]);

    const fetchSavedBlogs = () => {
        const cookies = new Cookies();
        const token = cookies.get("token");

        fetch(`${process.env.REACT_APP_API_URL}/savedBlog/user`, {
            method: "GET",
            headers: {
                authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) setSavedBlogs(data.data);
                else setSavedBlogs(null);
            });
    };

    useEffect(() => {
        fetchSavedBlogs();
    }, []);

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
                        return <Blog key={blog._id} idx={idx} onDelete={deleteBlog} userDetails={userDetails} blog={blog} />;
                    })}
            </Box>
            <Box className="saved-blogs">
                <Paper elevation={5} className="saved-blogs-actions">
                    <Typography color="primary.dark" variant="h6" className="icon-typography">
                        <BookmarkIcon />
                        Saved Blogs
                    </Typography>
                    <Button onClick={fetchSavedBlogs} variant="contained" size="small" sx={{ fontWeight: "bold" }}>
                        Reload
                    </Button>
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
        </Box>
    );
};

export default Feed;
