import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Alert, Snackbar, Box, Typography, Avatar, Paper, Button, Divider, Menu, MenuItem } from "@mui/material";
import { BlogTypeLabel, EditBlog } from "../components";
import TodayIcon from "@mui/icons-material/Today";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import "../styles/components/Blog.css";

const Blog = (props) => {
    const { userDetails, blog, idx, onDelete } = props;
    const [blogTitle, setBlogTitle] = useState(blog.blogTitle);
    const [blogType, setBlogType] = useState(blog.blogType);
    const [blogContent, setBlogContent] = useState(blog.blogContent);
    const [moreContent, setMoreContent] = useState(false);

    // Edit Controls
    const [editOpen, setEditOpen] = useState(false);
    const handleEditOpen = () => {
        setEditOpen(true);
        setAnchor(null);
    };
    const handleEditClose = () => setEditOpen(false);

    const onSuccessfulUpdate = (updatedDetails) => {
        setBlogTitle(updatedDetails.blogTitle);
        setBlogType(updatedDetails.blogType);
        setBlogContent(updatedDetails.blogContent);
    };

    // Save Controls
    const [isSaved, setIsSaved] = useState(false);
    const handleSaveBlog = () => {
        fetch(`${process.env.REACT_APP_API_URL}/savedBlog/${blog._id}`, {
            method: "POST",
            headers: {
                authorization: userDetails.token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setAnchor(null);
                setIsSaved(data.status);
            });
    };

    const handleUnsaveBlog = () => {
        fetch(`${process.env.REACT_APP_API_URL}/savedBlog/${blog._id}`, {
            method: "DELETE",
            headers: {
                authorization: userDetails.token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setAnchor(null);
                setIsSaved(!data.status);
            });
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/savedBlog/${blog._id}`, {
            method: "GET",
            headers: {
                authorization: userDetails.token,
            },
        })
            .then((res) => res.json())
            .then((data) => setIsSaved(data.status));
    }, [userDetails, blog]);

    // Toast Controls
    const [toastOpen, setToastOpen] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const handleToastClose = (event, reason) => {
        if (reason === "clickaway") return;
        setToastOpen(false);
    };

    // Menu Controls
    const [anchor, setAnchor] = useState(null);
    const open = Boolean(anchor);
    const handleOpen = (e) => setAnchor(e.currentTarget);
    const handleClose = () => setAnchor(null);

    const handleDeleteBlog = () => {
        fetch(`${process.env.REACT_APP_API_URL}/blog/${blog._id}`, {
            method: "DELETE",
            headers: {
                authorization: userDetails.token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    onDelete(idx);
                } else {
                    setToastOpen(true);
                    setDeleteError(data.error);
                }
            });
    };

    return (
        <Paper elevation={2} className="blog-wrapper">
            <Box className="blog-header">
                <Box className="blog-user-details">
                    <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", width: "32px", height: "32px", fontSize: "13px" }}>
                        {blog.createdBy.name.split(" ").map((part) => part[0].toUpperCase())}
                    </Avatar>
                    <Typography variant="h6">{blog.createdBy.name}</Typography>
                </Box>
                <Box className="blog-actions">
                    <MoreVertIcon fontSize="medium" color="primary.dark" onClick={handleOpen} sx={{ cursor: "pointer" }} />
                    <Menu onClose={handleClose} anchorEl={anchor} open={open}>
                        <MenuItem onClick={isSaved ? handleUnsaveBlog : handleSaveBlog}>
                            <Typography className="icon-typography">
                                {isSaved ? (
                                    <>
                                        <BookmarkRemoveIcon color="success" />
                                        Unsave Blog
                                    </>
                                ) : (
                                    <>
                                        <BookmarkAddIcon color="success" />
                                        Save Blog
                                    </>
                                )}
                            </Typography>
                        </MenuItem>
                        {userDetails.userId === blog.createdBy._id && (
                            <MenuItem onClick={handleEditOpen}>
                                <Typography className="icon-typography">
                                    <EditIcon color="warning" />
                                    Edit blog
                                </Typography>
                            </MenuItem>
                        )}
                        {userDetails.userId === blog.createdBy._id && (
                            <MenuItem onClick={handleDeleteBlog}>
                                <Typography className="icon-typography">
                                    <DeleteIcon color="error" />
                                    Delete Blog
                                </Typography>
                            </MenuItem>
                        )}
                    </Menu>
                </Box>
            </Box>
            <Divider />
            <Box className="blog-details">
                <Box className="blog-title-type">
                    <Typography variant="h6" fontWeight="bold">
                        {blogTitle}
                    </Typography>
                    <BlogTypeLabel label={blogType} />
                </Box>
                <Typography className="icon-typography">
                    <TodayIcon fontSize="small" color="primary" /> {new Date(blog.createdAt).toLocaleString()}
                </Typography>
            </Box>
            <Divider />
            <Box className="blog-content">
                {blogContent.length <= 150 ? (
                    <Typography sx={{ whiteSpace: "pre-line" }} variant="body1">
                        {blogContent}
                    </Typography>
                ) : (
                    <Typography sx={{ whiteSpace: "pre-line" }}>
                        {moreContent ? blogContent : blogContent.substr(0, 150)}
                        <Typography
                            className="more-content"
                            component="span"
                            onClick={() => {
                                setMoreContent(!moreContent);
                            }}
                            color="primary"
                            variant="text"
                        >
                            {moreContent ? "...Show less" : "...Read more"}
                        </Typography>
                    </Typography>
                )}
            </Box>
            <Divider />
            <Box>
                <Link className="link" to={`/blog/${blog._id}`}>
                    <Button variant="contained" color="primary" size="small" sx={{ fontWeight: "bold" }}>
                        View Activity
                    </Button>
                </Link>
            </Box>
            <Snackbar open={toastOpen} autoHideDuration={2500} onClose={handleToastClose}>
                <Alert onClose={handleToastClose} variant="filled" severity={deleteError !== "" ? "error" : "success"} sx={{ width: "100%" }}>
                    {deleteError !== "" ? deleteError : "Blog deleted successfully, Reloading"}
                </Alert>
            </Snackbar>
            <EditBlog blog={blog} open={editOpen} onClose={handleEditClose} userDetails={userDetails} onSuccessfulUpdate={onSuccessfulUpdate} />
        </Paper>
    );
};

export default Blog;
