import React, { useState } from "react";
import {
    Box,
    Divider,
    Typography,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
    FormControl,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import "../styles/components/EditBlog.css";
import { fetchUpdateBlogDetails } from "../requests";

const EditBlog = (props) => {
    const { open, onClose, blog, userDetails, onSuccessfulUpdate } = props;
    const [blogTitle, setBlogTitle] = useState(blog.blogTitle);
    const [blogTitleError, setBlogTitleError] = useState(false);
    const [blogType, setBlogType] = useState(blog.blogType);
    const [blogTypeError, setBlogTypeError] = useState(false);
    const [blogContent, setBlogContent] = useState(blog.blogContent);
    const [blogContentError, setBlogContentError] = useState(false);

    const [requestError, setRequestError] = useState("");
    const [visible, setVisible] = useState(false);

    const resetErrors = () => {
        setBlogTitleError(false);
        setBlogTypeError(false);
        setBlogContentError(false);
        setRequestError("");
    };

    const handleEdit = () => {
        resetErrors();
        if (!blogTitle) return setBlogTitleError(true);
        if (!blogType) return setBlogTypeError(true);
        if (!blogContent) return setBlogContentError(true);

        fetchUpdateBlogDetails(userDetails.token, blog._id, { blogTitle, blogType, blogContent }, (data) => {
            if (data.status) {
                setVisible(true);
                onSuccessfulUpdate({ blogTitle, blogContent, blogType });
                setTimeout(() => {
                    setRequestError("");
                    onClose();
                }, 750);
            } else {
                setRequestError(data.error);
                setVisible(true);
            }
        });
    };

    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
            <DialogTitle>
                <Typography className="icon-typography" color="primary.dark" sx={{ fontWeight: "bold" }} component="span" variant="h6">
                    <EditIcon />
                    Edit blog
                </Typography>
            </DialogTitle>
            <Divider color="black" />
            <DialogContent className="edit-blog-form" sx={{ bgcolor: "background.dark" }}>
                <Box className="edit-blog-form-segment row-segment">
                    <Typography className="icon-typography" variant="h6">
                        <InfoIcon />
                        Blog Title
                    </Typography>
                    <TextField
                        color="primary"
                        error={blogTitleError}
                        label="Blog Title"
                        value={blogTitle}
                        sx={{ flex: "1" }}
                        size="small"
                        onChange={(e) => setBlogTitle(e.target.value)}
                    />
                </Box>
                <Box className="edit-blog-form-segment row-segment">
                    <Typography className="icon-typography" variant="h6">
                        <InfoIcon />
                        Blog Type
                    </Typography>
                    <FormControl sx={{ flex: "1" }} size="small">
                        <Select
                            error={blogTypeError}
                            id="blog-type-select"
                            color="primary"
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
                <Box className="edit-blog-form-segment">
                    <TextField
                        color="primary"
                        error={blogContentError}
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        multiline
                        label="Blog content"
                        rows={10}
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <Divider color="black" />
            <DialogActions sx={{ justifyContent: "space-between" }}>
                <Box>
                    {visible && (
                        <Typography className="icon-typography" color={requestError !== "" ? "error" : "green"}>
                            <InfoIcon />
                            {requestError !== "" ? requestError : "Blog edited successfuly"}
                        </Typography>
                    )}
                </Box>
                <Box className="edit-blog-actions">
                    <Button variant="contained" color="error" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="success" onClick={handleEdit}>
                        Save
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default EditBlog;
