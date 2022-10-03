import React from "react";
import { Typography, Box } from "@mui/material";

const BlogTypeLabel = (props) => {
    const { label, variant } = props;

    const getColor = (label) => {
        if (label === "Devlog") return "#aaffcc";
        else if (label === "Misc") return "#ff9082";
        else if (label === "Learning") return "#faeca2";
        else if (label === "Topics") return "#aaaaff";
    };

    return (
        <Box sx={{ bgcolor: getColor(label), padding: ".15rem .3rem", borderRadius: "7px" }}>
            <Typography variant={variant ? variant : "caption"} sx={{ fontWeight: "bold", color: "black" }}>
                {label}
            </Typography>
        </Box>
    );
};

export default BlogTypeLabel;
