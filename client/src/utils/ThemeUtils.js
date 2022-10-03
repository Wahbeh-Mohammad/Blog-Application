import { createTheme } from "@mui/material";

const primary = {
    main: "#FFABA6",
    light: "#FFCBC8",
    dark: "#F5736B",
    contrastText: "#000000",
};

export const lightTheme = createTheme({
    typography: {
        fontFamily: ["Ubuntu", "sans-serif"].join(","),
    },
    palette: {
        mode: "light",
        primary: primary,
        text: {
            default: "#000000",
            onPrimary: "#000000",
            onSecondary: "#000000",
        },
        background: {
            default: "#fafafa",
            header: "#f0f0f0",
            paper: "#fff",
        },
    },
});

export const darkTheme = createTheme({
    typography: {
        fontFamily: ["Ubuntu", "sans-serif"].join(","),
    },
    palette: {
        mode: "dark",
        primary: primary,
        text: {
            default: "#FFFFFF",
            onPrimary: "#FFFFFF",
            onSecondary: "#FFFFFF",
        },
        background: {
            default: "#141414",
            header: "#161616",
            paper: "#121212",
        },
    },
});
