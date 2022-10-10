import React from "react";
import { Typography } from "@mui/material";
import Linkify from "react-linkify";

const LinkifiedText = ({ children }) => {
    return (
        <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
                <a rel="noreferrer" target="_blank" href={decoratedHref} className="link" key={key}>
                    <Typography component="span" color="text.default" sx={{ textDecoration: "underline" }} fontSize="inherit">
                        {decoratedText}
                    </Typography>
                </a>
            )}
        >
            {children}
        </Linkify>
    );
};

export default LinkifiedText;
