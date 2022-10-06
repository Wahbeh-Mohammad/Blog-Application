import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Avatar, Paper, Button, Divider, Menu, MenuItem } from "@mui/material";
import { BlogTypeLabel, EditBlog, Toast } from "../components";
import TodayIcon from "@mui/icons-material/Today";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import "../styles/components/Blog.css";
import { fetchDeleteBlog, fetchSaveBlog, fetchSaveCheck, fetchUnsaveBlog } from "../requests";

const Blog = (props) => {
    const { userDetails, blog, idx, onDelete, afterSaveUnsaveOperation } = props;
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
        fetchSaveBlog(userDetails.token, blog._id, (data) => {
            setAnchor(null);
            if (data.status) afterSaveUnsaveOperation();
            setIsSaved(data.status);
        });
    };

    const handleUnsaveBlog = () => {
        fetchUnsaveBlog(userDetails.token, blog._id, (data) => {
            setAnchor(null);
            if (data.status) afterSaveUnsaveOperation();
            setIsSaved(!data.status);
        });
    };

    useEffect(() => {
        fetchSaveCheck(userDetails.token, blog._id, (data) => setIsSaved(data.status));
    }, [userDetails, blog]);

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

    // Menu Controls
    const [anchor, setAnchor] = useState(null);
    const open = Boolean(anchor);
    const handleOpen = (e) => setAnchor(e.currentTarget);
    const handleClose = () => setAnchor(null);

    const handleDeleteBlog = () => {
        fetchDeleteBlog(userDetails.token, blog._id, (data) => {
            if (data.status) {
                onDelete(idx);
            } else {
                setToastOpen(true);
                setToastContent(data.error);
                setToastSeverity("error");
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
            <Toast open={toastOpen} onClose={handleToastClose} severity={toastSeverity} toastContent={toastContent} />
            <EditBlog blog={blog} open={editOpen} onClose={handleEditClose} userDetails={userDetails} onSuccessfulUpdate={onSuccessfulUpdate} />
        </Paper>
    );
};

export default Blog;
