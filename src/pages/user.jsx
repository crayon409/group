import React from "react";
import UserForm from "../components/user_form";
import UserList from "./user_list";
import { Col, Flex } from "antd";
const User = () => {
    return (<Flex gap="middle" justify="start">
        <Col span={24} style={{
            overflow: "hidden",
        }}>
            <Col span={24}>
                <UserList />
            </Col>
        </Col>
    </Flex>);
};
export default User;