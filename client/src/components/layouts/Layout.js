import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../partials/Header";

const Layout = (props) => {
    const { theme, setTheme } = props;

    return (
        <Box className="main-layout" sx={{ bgcolor: "background.default" }}>
            <Header setTheme={setTheme} theme={theme} />
            <Outlet />
        </Box>
    );
};

export default Layout;
