import React from 'react';
import { DownOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import UserAvatar from './avatar';

const items = [
    {
        key: '1',
        label: '个人中心',
        icon: <UserOutlined />,
    },
    {
        key: '2',
        label: '退出',
        icon: <SettingOutlined />,
        onClick: () => {
            // localStorage.removeItem('token');
            window.location.href = '/login';
        },
    },
];
const UserProfile = () => (
    <Dropdown
        menu={{
            items,
        }}
    >
        <a onClick={(e) => e.preventDefault()}>
            <Space>
                <UserAvatar />
            </Space>
        </a>
    </Dropdown>
);
export default UserProfile;