import React from "react";

import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    TeamOutlined,
    UserOutlined,
    FileOutlined,
    SettingOutlined,
    ShopOutlined,
} from '@ant-design/icons';
import { Affix, Col, Layout, Menu, Space } from 'antd';
import config from '../config/app';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router'
import UserProfile from "./common/userProfile";

const { Header, Content, Footer, Sider } = Layout;

const siderStyle = {
    backgroundColor: '#e8e8e8',
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
};

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('系统管理', '1', <SettingOutlined />, [
        getItem(<Link to={'/user'} >用户管理</Link>, '7'),
    ]),
    getItem('商品管理', '2', <ShopOutlined />, [
        getItem(<Link to={'/category'} >商品分类</Link>, '3'),
        getItem(<Link to={'/goods'} >商品列表</Link>, '4'),
    ]),
    getItem('订单管理', '5', <FileOutlined />, [
        getItem(<Link to={'/order'} >订单列表</Link>, '6'),
    ]),
];
const LayoutFrame = () => {

    return (
        <Layout hasSider
            style={{
                width: '100vw',
            }}>
            <Sider style={siderStyle}>
                <div className="demo-logo-vertical" />
                <Affix offsetTop={3}>
                    <h1 style={{
                        color: "#333",
                        textAlign: "center",
                        fontSize: "1.6rem",
                        lineHeight: "2",
                        backgroundColor: "#fff",
                    }}>{config.site_name}</h1>
                </Affix>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                />
            </Sider>
            <Layout style={{
                backgroundColor: '#f00',
            }}>
                <Header
                    style={{
                        textAlign: 'right',
                        backgroundColor: '#fff',
                        width: '100%',
                        height: '60px',
                        padding: '0 20px',
                    }}
                >
                    <Space >
                        <UserProfile />
                    </Space>
                </Header>
                <Content
                    style={{
                        padding: '18px',
                        backgroundColor: '#fff',
                        overflow: 'auto',
                        width: 'calc(100vw - 200px)', // 减去Sider的宽度
                        height: 'calc(100vh - 140px)', // 减去Header和Footer的高度
                    }}
                >
                    <Outlet />
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Created by {config.author}
                </Footer>
            </Layout>
        </Layout>
    );
};
export default LayoutFrame;