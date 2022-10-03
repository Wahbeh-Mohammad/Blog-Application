import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

const Profile = (props) => {
    const { id } = useParams();

    useEffect(() => {}, [id]);

    return <Box className="profile"></Box>;
};

export default Profile;
