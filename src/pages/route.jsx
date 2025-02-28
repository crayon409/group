import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Layout from './layout';
import Home from './home';
import User from './user';
import Goods from './goods';
import Category from './category';
import Order from './order';

const RouteLayout = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 这里可以添加检查用户是否已登录的逻辑
        // 例如从localStorage中读取token并验证
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={isLoggedIn ? <Layout /> : <Login />}>
                    <Route path="home" element={<Home />} />
                    <Route path="user" element={<User />} />
                    <Route path="goods" element={<Goods />} />
                    <Route path="category" element={<Category />} />
                    <Route path="order" element={<Order />} />
                </Route>
                <Route path="/login" element={!isLoggedIn ? <Login /> : null} />
            </Routes>
        </Router>
    );
};

export default RouteLayout;