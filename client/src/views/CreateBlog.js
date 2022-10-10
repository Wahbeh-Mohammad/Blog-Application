import React, { useState } from "react";
import Cookies from "universal-cookie";
import { Box, Divider, FormControl, MenuItem, Select, TextField, Typography, Button, Paper } from "@mui/material";
import { Toast } from "../components";
import InfoIcon from "@mui/icons-material/Info";
import "../styles/CreateBlog.css";
import { fetchCreateBlog } from "../utils/requests";

const CreateBlog = (props) => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    // New blog details and related stuff
    const [blogTitle, setBlogTitle] = useState("");
    const [blogTitleError, setBlogTitleError] = useState(false);
    const [blogType, setBlogType] = useState("Misc");
    const [blogTypeError, setBlogTypeError] = useState(false);
    const [blogContent, setBlogContent] = useState("");
    const [blogContentError, setBlogContentError] = useState(false);

    const resetErrors = () => {
        setBlogTitleError(false);
        setBlogTypeError(false);
        setBlogContentError(false);
    };

    const handleSubmit = () => {
        resetErrors();
        if (!blogTitle) return setBlogTitleError(true);
        if (!blogType) return setBlogTypeError(true);
        if (!blogContent) return setBlogContentError(true);

        fetchCreateBlog({ blogTitle, blogContent: blogContent.trim(), blogType }, token, (data) => {
            if (data.status) {
                setToastContent("New blog created!, redirecting to feed.");
                setToastSeverity("success");
                setToastOpen(true);
                setTimeout(() => window.location.assign("/feed"), 1250);
            } else {
                setToastContent(data.error);
                setToastSeverity("error");
                setToastOpen(true);
            }
        });
    };

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
                            {["Misc", "Devlog", "Learning", "Topics"].map((value) => {
                                return (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                );
                            })}
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
                <Toast open={toastOpen} onClose={handleToastClose} severity={toastSeverity} toastContent={toastContent} />
            </Paper>
        </Box>
    );
};

export default CreateBlog;
