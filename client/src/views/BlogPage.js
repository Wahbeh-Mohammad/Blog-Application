import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { Divider, Button, Avatar, Box, Typography, TextField, Paper } from "@mui/material";
import { BlogTypeLabel, EditBlog, Comment, Toast, LinkifiedText } from "../components";
import CommentIcon from "@mui/icons-material/Comment";
import InfoIcon from "@mui/icons-material/Info";
import TodayIcon from "@mui/icons-material/Today";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import { fetchCreateComment, fetchDeleteBlog, fetchSaveBlog, fetchSaveCheck, fetchSpecificBlog, fetchUnsaveBlog } from "../utils/requests";
import "../styles/FullBlog.css";

const BlogPage = () => {
    const cookies = new Cookies();
    const userId = cookies.get("id");
    const token = cookies.get("token");

    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [blogEditDetails, setBlogEditDetails] = useState({});

    // Edit & Update Controls
    const [editOpen, setEditOpen] = useState(false);
    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);

    const onSuccessfulUpdate = (updatedDetails) => {
        setBlog({ ...blog, blogTitle: updatedDetails.blogTitle, blogContent: updatedDetails.blogContent, blogType: updatedDetails.blogType });
    };

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

    // Delete Controls
    const handleDeleteBlog = () => {
        fetchDeleteBlog(token, id, (data) => {
            if (data.status) {
                setToastContent("Blog has been deleted");
                setToastSeverity("success");
                setToastOpen(true);
                setTimeout(() => window.location.assign("/feed"), 2000);
            } else {
                setToastContent(data.error);
                setToastSeverity("error");
                setToastOpen(true);
            }
        });
    };

    // Save Controls
    const [isSaved, setIsSaved] = useState(false);
    const handleSaveBlog = () => fetchSaveBlog(token, id, (data) => setIsSaved(data.status));
    const handleUnsaveBlog = () => fetchUnsaveBlog(token, id, (data) => setIsSaved(!data.status));

    // Comment Controls
    const [newComment, setNewComment] = useState("");
    const [newCommentError, setNewCommentError] = useState(false);

    const handleCreateComment = () => {
        setNewCommentError(false);
        if (!newComment.trim()) return setNewCommentError(true);

        fetchCreateComment(token, { blogId: id, commentContent: newComment.trim() }, (data) => {
            if (data.status) {
                setComments([...comments, data.data]);
                setNewComment("");
            } else {
                setToastContent(data.error);
                setToastSeverity("error");
            }
        });
    };

    const onSuccessfulCommentDelete = (idx) => {
        setComments((comments) => comments.filter((_, index) => index !== idx));
    };

    useEffect(() => {
        if (!token) return window.location.assign("/");

        fetchSpecificBlog(token, id, (data) => {
            if (data.status) {
                setBlog(data.data);
                setBlogEditDetails(data.data);
                setComments(data.comments);
            } else {
                setToastOpen(true);
                setToastContent(data.error);
                setToastSeverity("error");
            }
        });

        fetchSaveCheck(token, id, (data) => setIsSaved(data.status));
    }, [id, token]);

    return (
        <Box className="full-blog-wrapper">
            <Box className="author-section">
                {blog !== null && (
                    <Box className="author-card">
                        <Box className="flex-row centered">
                            <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontSize: "16px" }}>
                                {blog.createdBy.name.split(" ").map((part) => part[0].toUpperCase())}
                            </Avatar>
                            <Typography variant="h5" color="text.default">
                                {blog.createdBy.name}
                            </Typography>
                        </Box>
                        <Divider />
                        <Typography variant="h6" color="text.default" sx={{ whiteSpace: "pre-line" }}>
                            <LinkifiedText>{blog.createdBy.biography}</LinkifiedText>
                        </Typography>
                    </Box>
                )}
            </Box>
            <Box className="blog-section overflow custom-scrollbar">
                {blog !== null && (
                    <>
                        <Box className="blog-section-header">
                            <Box className="bsh-top">
                                <Box className="flex-row centered bsh-user" sx={{ gap: ".75rem" }}>
                                    <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontSize: "16px" }}>
                                        {blog.createdBy.name.split(" ").map((part) => part[0].toUpperCase())}
                                    </Avatar>
                                    <Typography variant="h5" color="text.default">
                                        {blog.createdBy.name}
                                    </Typography>
                                </Box>
                                <Box className="bsh-controls">
                                    {isSaved ? (
                                        <BookmarkRemoveIcon sx={{ cursor: "pointer", fontSize: "30px" }} onClick={handleUnsaveBlog} color="success" />
                                    ) : (
                                        <BookmarkAddIcon sx={{ cursor: "pointer", fontSize: "30px" }} onClick={handleSaveBlog} color="success" />
                                    )}
                                    {blog.createdBy._id === userId && (
                                        <>
                                            <EditIcon onClick={handleEditOpen} sx={{ cursor: "pointer", fontSize: "30px" }} color="warning" />
                                            <DeleteIcon onClick={handleDeleteBlog} sx={{ cursor: "pointer", fontSize: "30px" }} color="error" />
                                        </>
                                    )}
                                </Box>
                            </Box>
                            <Divider />
                            <Box className="bsh-bottom">
                                <Typography color="text.default" variant="h4" className="icon-typography">
                                    <InfoIcon fontSize="large" color="primary" />
                                    {blog.blogTitle}
                                    <BlogTypeLabel label={blog.blogType} variant="h6" />
                                </Typography>
                                <Typography color="text.default" variant="h6" className="icon-typography">
                                    <TodayIcon fontSize="medium" color="primary" />
                                    {new Date(blog.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
                        <Divider />
                        <Box className="blog-section-details">
                            <Typography variant="h6" color="text.default" sx={{ whiteSpace: "pre-line" }}>
                                <LinkifiedText>{blog.blogContent}</LinkifiedText>
                            </Typography>
                        </Box>
                        <EditBlog
                            blog={blogEditDetails}
                            open={editOpen}
                            onClose={handleEditClose}
                            userDetails={{ userId, token }}
                            onSuccessfulUpdate={onSuccessfulUpdate}
                        />
                    </>
                )}
            </Box>
            <Box className="comment-section overflow custom-scrollbar">
                <Paper elevation={5} className="create-comment">
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
            <Toast severity={toastSeverity} toastContent={toastContent} onClose={handleToastClose} open={toastOpen} />
        </Box>
    );
};

export default BlogPage;
