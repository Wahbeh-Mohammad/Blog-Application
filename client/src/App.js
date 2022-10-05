import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { Home, Register, Login, Feed, CreateBlog, BlogPage, Profile } from "./views";
import { lightTheme, darkTheme } from "./utils/ThemeUtils";
import "./styles/Global.css";
import { Layout } from "./components";

const App = (props) => {
    const [theme, setTheme] = useState("dark");

    return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
            <Router>
                <Routes>
                    <Route exact path="/register" element={<Register setTheme={setTheme} theme={theme} />} />
                    <Route exact path="/login" element={<Login setTheme={setTheme} theme={theme} />} />
                    <Route element={<Layout setTheme={setTheme} theme={theme} />}>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/feed" element={<Feed />} />
                        <Route exact path="/blog/new" element={<CreateBlog />} />
                        <Route exact path="/blog/:id" element={<BlogPage />} />
                        <Route exact path="/profile" element={<Profile />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
