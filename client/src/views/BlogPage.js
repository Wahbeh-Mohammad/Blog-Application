import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { Divider, Button, Avatar, Box, Typography, Snackbar, Alert, TextField, Paper } from "@mui/material";
import { BlogTypeLabel, EditBlog, Comment } from "../components";
import CommentIcon from "@mui/icons-material/Comment";
import InfoIcon from "@mui/icons-material/Info";
import TodayIcon from "@mui/icons-material/Today";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import "../styles/FullBlog.css";

const BlogPage = () => {
    const cookies = new Cookies();
    const { id } = useParams();
    const [userId] = useState(cookies.get("id"));
    const [token] = useState(cookies.get("token"));
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [blogEditDetails, setBlogEditDetails] = useState({});
    const [error, setError] = useState("");

    // Edit Controls
    const [editOpen, setEditOpen] = useState(false);
    const handleEditOpen = () => {
        setEditOpen(true);
    };
    const handleEditClose = () => setEditOpen(false);
    const onSuccessfulUpdate = (updatedDetails) => {
        setBlog({ ...blog, blogTitle: updatedDetails.blogTitle, blogContent: updatedDetails.blogContent, blogType: updatedDetails.blogType });
    };

    // Toast Controls
    const [toastOpen, setToastOpen] = useState(false);
    const [toastValue, setToastValue] = useState("");

    const handleToastClose = (event, reason) => {
        if (reason === "clickaway") return;
        setToastOpen(false);
    };

    // Delete Controls
    const handleDeleteBlog = () => {
        fetch(`${process.env.REACT_APP_API_URL}/blog/${id}`, {
            method: "DELETE",
            headers: {
                authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setToastOpen(true);
                    setTimeout(() => window.location.assign("/feed"), 2000);
                } else {
                    setToastOpen(true);
                    setToastValue(data.error);
                }
            });
    };

    // Save Controls
    const [isSaved, setIsSaved] = useState(false);
    const handleSaveBlog = () => {
        fetch(`${process.env.REACT_APP_API_URL}/savedBlog/${blog._id}`, {
            method: "POST",
            headers: {
                authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setIsSaved(data.status);
            });
    };

    const handleUnsaveBlog = () => {
        fetch(`${process.env.REACT_APP_API_URL}/savedBlog/${blog._id}`, {
            method: "DELETE",
            headers: {
                authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setIsSaved(!data.status);
            });
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/savedBlog/${id}`, {
            method: "GET",
            headers: {
                authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => setIsSaved(data.status));
    }, [token, id]);

    // Comment Controls
    const [newComment, setNewComment] = useState("");
    const [newCommentError, setNewCommentError] = useState(false);

    const onSuccessfulCommentDelete = (idx) => {
        setComments((comments) => comments.filter((_, index) => index !== idx));
    };

    const handleCreateComment = () => {
        if (!newComment) return setNewCommentError(true);

        fetch(`${process.env.REACT_APP_API_URL}/comment/new`, {
            method: "POST",
            headers: {
                authorization: token,
                "content-type": "application/json",
            },
            body: JSON.stringify({ blogId: id, commentContent: newComment }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.status) {
                    setComments([...comments, data.data]);
                    setNewComment("");
                } else {
                    setToastValue(data.error);
                }
            });
    };

    useEffect(() => {
        if (!token) return window.location.assign("/");

        fetch(`${process.env.REACT_APP_API_URL}/blog/${id}`, {
            method: "GET",
            headers: {
                authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setBlog(data.data);
                    setBlogEditDetails(data.data);
                    setComments(data.comments);
                } else {
                    setError(data.error);
                }
            });
    }, [id, token]);

    return (
        <Box className="full-blog-wrapper">
            {blog !== null && (
                <>
                    <Box className="full-blog" sx={{ bgcolor: "background.default" }}>
                        <Box className="full-blog-header">
                            <Box className="full-blog-header-p1">
                                <Box className="flex-row centered">
                                    <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontSize: "16px" }}>
                                        {blog.createdBy.name.split(" ").map((part) => part[0].toUpperCase())}
                                    </Avatar>
                                    <Typography variant="h5" color="text.primary">
                                        {blog.createdBy.name}
                                    </Typography>
                                </Box>
                                <Box className="full-blog-actions">
                                    {isSaved ? (
                                        <BookmarkRemoveIcon fontSize="large" sx={{ cursor: "pointer" }} onClick={handleUnsaveBlog} color="success" />
                                    ) : (
                                        <BookmarkAddIcon fontSize="large" sx={{ cursor: "pointer" }} onClick={handleSaveBlog} color="success" />
                                    )}

                                    {blog.createdBy._id === userId && (
                                        <>
                                            <EditIcon onClick={handleEditOpen} sx={{ cursor: "pointer" }} fontSize="large" color="warning" />
                                            <DeleteIcon onClick={handleDeleteBlog} sx={{ cursor: "pointer" }} fontSize="large" color="error" />
                                        </>
                                    )}
                                </Box>
                            </Box>
                            <Box>
                                <Typography className="icon-typography" variant="h6" color="text.primary">
                                    <TodayIcon fontSize="large" color="primary" />
                                    Created At: {new Date(blog.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
                        <Divider flexItem />
                        <Box className="full-blog-content">
                            <Box className="flex-row centered full-blog-title">
                                <Typography variant="h4" className="icon-typography" color="text.primary">
                                    <InfoIcon fontSize="large" />
                                    {blog.blogTitle}
                                </Typography>
                                <BlogTypeLabel label={blog.blogType} variant="overline" />
                            </Box>
                            <Typography color="text.primary" sx={{ whiteSpace: "pre-line" }} variant="h6">
                                {blog.blogContent}
                            </Typography>
                        </Box>
                        <EditBlog
                            blog={blogEditDetails}
                            open={editOpen}
                            onClose={handleEditClose}
                            userDetails={{ userId, token }}
                            onSuccessfulUpdate={onSuccessfulUpdate}
                        />
                    </Box>
                    <Box className="blog-activity" sx={{ bgcolor: "background.default" }}>
                        <Paper elevation={5} className="create-comment" sx={{ bgcolor: "background.paper" }}>
                            <Box className="flex-row centered" sx={{ justifyContent: "space-between", paddingBottom: "1rem" }}>
                                <Typography className="icon-typography" variant="h4" color="primary">
                                    <CommentIcon fontSize="large" />
                                    Activity
                                </Typography>
                                <Button variant="contained" color="primary" onClick={handleCreateComment}>
                                    Submit
                                </Button>
                            </Box>
                            <TextField
                                error={newCommentError}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                label="Leave a comment"
                                multiline
                                rows={5}
                                fullWidth
                                color="primary"
                                variant="outlined"
                                placeholder="Whats on your mind?"
                            />
                        </Paper>
                        <Box className="blog-comments">
                            {(comments !== null || comments !== []) &&
                                comments.map((comment, idx) => {
                                    return (
                                        <Comment
                                            key={comment._id}
                                            userDetails={{ userId, token }}
                                            comment={comment}
                                            idx={idx}
                                            onDelete={onSuccessfulCommentDelete}
                                        />
                                    );
                                })}
                        </Box>
                    </Box>
                    <Snackbar open={toastOpen} autoHideDuration={2500} onClose={handleToastClose}>
                        <Alert onClose={handleToastClose} variant="filled" severity={toastValue !== "" ? "error" : "success"} sx={{ width: "100%" }}>
                            {toastValue !== "" ? toastValue : "Blog deleted successfully"}
                        </Alert>
                    </Snackbar>
                </>
            )}
            {error && (
                <Box className="error-box">
                    <Typography variant="h4" color="error" className="icon-typography">
                        <InfoIcon fontSize="large" />
                        {error}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default BlogPage;
