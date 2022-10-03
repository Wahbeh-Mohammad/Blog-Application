import React from "react";
import { Link } from "react-router-dom";
import { Button, Box, Typography, Paper, Avatar, Divider } from "@mui/material";
import "../styles/components/SavedBlog.css";

const SavedBlog = (props) => {
    const { userDetails, blog } = props;

    return (
        <Paper elevation={5} className="saved-blog">
            <Box className="saved-blog-header saved-blog-part">
                <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", width: "32px", height: "32px", fontSize: "13px" }}>
                    {userDetails.name.split(" ").map((part) => part[0].toUpperCase())}
                </Avatar>
                <Typography variant="h6">{userDetails.name}</Typography>
            </Box>
            <Divider />
            <Box className="saved-blog-details saved-blog-part">
                <Typography gutterBottom variant="subtitle1">
                    {blog.blogId.blogTitle}
                </Typography>
            </Box>
            <Divider />
            <Box className="saved-blog-part">
                <Link className="link" to={`/blog/${blog.blogId._id}`}>
                    <Button size="small" variant="contained" color="primary" sx={{ fontWeight: "bold" }}>
                        View Blog
                    </Button>
                </Link>
            </Box>
        </Paper>
    );
};

export default SavedBlog;
