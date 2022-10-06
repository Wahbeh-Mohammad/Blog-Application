import React from "react";
import { Snackbar, Alert } from "@mui/material";

const Toast = (props) => {
    const { open, onClose, toastContent, severity } = props;

    return (
        <>
            {open && (
                <Snackbar open={open} autoHideDuration={2500} onClose={onClose}>
                    <Alert onClose={onClose} variant="filled" severity={severity} sx={{ width: "100%" }}>
                        {toastContent}
                    </Alert>
                </Snackbar>
            )}
        </>
    );
};

export default Toast;
