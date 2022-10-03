import React, { useState } from "react";
import { Box, Divider, FormControl, MenuItem, Select, TextField, Typography, Button, Paper, Snackbar, Alert } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import "../styles/CreateBlog.css";
import Cookies from "universal-cookie";

const CreateBlog = (props) => {
    const [userToken] = useState(new Cookies().get("token"));
    const [blogTitle, setBlogTitle] = useState("");
    const [blogTitleError, setBlogTitleError] = useState(false);
    const [blogType, setBlogType] = useState("Misc");
    const [blogTypeError, setBlogTypeError] = useState(false);
    const [blogContent, setBlogContent] = useState("");
    const [blogContentError, setBlogContentError] = useState(false);
    const [formError, setFormError] = useState("");

    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;

        setOpen(false);
    };

    const resetErrors = () => {
        setBlogTitleError(false);
        setBlogTypeError(false);
        setFormError("");
    };

    const handleSubmit = () => {
        resetErrors();
        if (!blogTitle) return setBlogTitleError(true);
        if (!blogType) return setBlogTypeError(true);
        if (!blogContent) return setBlogContentError(true);

        fetch(`${process.env.REACT_APP_API_URL}/blog/new`, {
            method: "POST",
            headers: {
                authorization: userToken,
                "content-type": "application/json",
            },
            body: JSON.stringify({ blogTitle, blogContent: blogContent.trim(), blogType }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setOpen(true);
                    setTimeout(() => {
                        window.location.assign("/feed");
                    }, 1250);
                } else {
                    setOpen(true);
                    setFormError(data.error);
                }
            });
    };

    return (
        <Box className="create-blog-wrapper center-component-within">
            <Paper elevation={5} className="create-blog">
                <Typography className="form-title" sx={{ bgcolor: "primary.dark", color: "primary.contrastText" }} variant="h4">
                    New Blog
                </Typography>
                <Box className="editor-segment">
                    <Typography className="icon-typography" color="primary.dark" variant="h6" gutterBottom>
                        <InfoIcon />
                        Blog Title
                    </Typography>
                    <TextField
                        color="primary"
                        sx={{ flex: "1" }}
                        size="small"
                        error={blogTitleError}
                        variant="outlined"
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                    />
                </Box>
                <Divider />
                <Box className="editor-segment">
                    <Typography color="primary.dark" className="icon-typography" variant="h6">
                        <InfoIcon />
                        Blog Type
                    </Typography>
                    <FormControl sx={{ flex: "1" }} size="small" error={blogTypeError}>
                        <Select
                            color="primary"
                            id="blog-type-select"
                            defaultValue={"Misc"}
                            onChange={(e) => setBlogType(e.target.value)}
                            value={blogType}
                        >
                            <MenuItem value="Misc">Misc</MenuItem>
                            <MenuItem value="Devlog">Devlog</MenuItem>
                            <MenuItem value="Learning">Learning</MenuItem>
                            <MenuItem value="Topics">Topics</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Divider />
                <Box className="editor-segment">
                    <TextField
                        color="primary"
                        value={blogContent}
                        error={blogContentError}
                        onChange={(e) => setBlogContent(e.target.value)}
                        multiline
                        label="Blog content"
                        rows={10}
                        fullWidth
                    />
                </Box>
                <Divider />
                <Box className="create-blog-actions editor-segment">
                    <Button color="primary" variant="contained" onClick={handleSubmit}>
                        Create new Blog
                    </Button>
                </Box>
                <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
                    <Alert onClose={handleClose} variant="filled" severity={formError !== "" ? "error" : "success"} sx={{ width: "100%" }}>
                        {formError !== "" ? formError : "New blog created Successfully, Redirecting"}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default CreateBlog;
