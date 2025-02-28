import React from 'react';
import { AntDesignOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
const userAvatar = () => (
    <Space direction="vertical" size={16}>
        <Space wrap size={16}>
            <Avatar
                size={{
                    xs: 24,
                    sm: 32,
                    md: 32,
                    lg: 32,
                    xl: 32,
                    xxl: 32,
                }}
                icon={<AntDesignOutlined />}
            />

            Root
        </Space>
    </Space>
);
export default userAvatar;