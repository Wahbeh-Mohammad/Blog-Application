import React, { useState } from "react";
import { Avatar, Box, Paper, Divider, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TodayIcon from "@mui/icons-material/Today";
import "../styles/components/Comment.css";

const Comment = (props) => {
    const { userDetails, idx, onDelete } = props;

    const [comment, setComment] = useState(props.comment);
    // Dialog && Edit Comment controls
    const [newComment, setNewComment] = useState("");
    const [newCommentError, setNewCommentError] = useState(false);
    const [open, setOpen] = useState(false);
    const [requestInfo, setRequestInfo] = useState("");
    const [info, setInfo] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleEditComment = () => {
        // reset errors
        setInfo(false);
        setNewCommentError(false);

        if (!newComment.trim()) return setNewCommentError(true);

        fetch(`${process.env.REACT_APP_API_URL}/comment/${comment._id}`, {
            method: "PUT",
            headers: {
                authorization: userDetails.token,
                "content-type": "application/json",
            },
            body: JSON.stringify({ commentContent: newComment }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setInfo(true);
                    setComment((prev) => {
                        return { ...prev, commentContent: newComment };
                    });
                } else {
                    setInfo(true);
                    setRequestInfo(data.error);
                }
            });
    };

    const handleDeleteComment = () => {
        fetch(`${process.env.REACT_APP_API_URL}/comment/${comment._id}`, {
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
                    alert(data.error);
                }
            });
    };

    return (
        <Paper elevation={5} className="comment">
            <Box className="comment-header comment-part">
                <Box className="comment-header-part1">
                    <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontSize: "16px" }}>
                        {comment.createdBy.name.split(" ").map((part) => part[0].toUpperCase())}
                    </Avatar>
                    <Typography variant="h6">{comment.createdBy.name}</Typography>
                </Box>
                <Box className="comment-actions">
                    {comment.createdBy._id === userDetails.userId && (
                        <>
                            <EditIcon onClick={handleOpen} sx={{ cursor: "pointer" }} fontSize="medium" color="warning" />
                            <DeleteIcon onClick={handleDeleteComment} sx={{ cursor: "pointer" }} fontSize="medium" color="error" />
                        </>
                    )}
                </Box>
            </Box>
            <Typography className="comment-part icon-typography" variant="caption">
                <TodayIcon fontSize="small" color="primary" />
                Created At: {new Date(comment.createdAt).toLocaleString()}
            </Typography>
            <Divider />
            <Box className="comment-part">
                <Typography sx={{ whiteSpace: "pre-line" }} variant="subtitle1">
                    {comment.commentContent}
                </Typography>
            </Box>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography className="icon-typography" color="primary" sx={{ fontWeight: "bold" }}>
                        <EditIcon />
                        Edit Comment
                    </Typography>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Box className="edit-box">
                        <TextField
                            error={newCommentError}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            multiline
                            label="Update Comment"
                            fullWidth
                            rows={5}
                        />
                    </Box>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        {info && (
                            <Typography className="icon-typography" variant="h6" color={requestInfo ? "error" : "green"}>
                                <InfoIcon />
                                {requestInfo ? requestInfo : "Comment Updated Successfuly"}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ display: "flex", gap: ".5rem" }}>
                        <Button onClick={handleClose} variant="contained" color="error">
                            Cancel
                        </Button>
                        <Button onClick={handleEditComment} variant="contained" color="success">
                            Save
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default Comment;
