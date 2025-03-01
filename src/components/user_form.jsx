import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Space } from 'antd';
import http from '../utils/http';
const UserForm = (props) => {
    const { action, refresh, setRefresh } = props;
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const title = () => {
        return (action == 'add' ? '新增' : '编辑') + '用户';
    }
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const SubmitButton = ({ form, children }) => {
        const [submittable, setSubmittable] = React.useState(false);

        const onSubmit = () => {
            let values = form.getFieldsValue();
            let postvalues = { nickname: values['username'], ...values }
            console.log(values, postvalues);
            form.setFieldsValue(postvalues)
            http.post('/User/add', postvalues)
                .then(res => {
                    if (res['code'] != 0) {
                        alert(res.msg)
                        return
                    }
                    setOpen(false)
                    setRefresh(refresh + 1);
                })
                .catch(res => {
                    console.log(res)
                })
        };
        // Watch all values
        const values = Form.useWatch([], form);
        useEffect(() => {
            form.validateFields({
                validateOnly: true,
            })
                .then(() => setSubmittable(true))
                .catch(() => setSubmittable(false));
        }, [form, values]);
        return (
            <Button type="primary" htmlType="submit" onClick={onSubmit} disabled={!submittable}>
                {children}
            </Button>
        );
    };

    return (
        <>
            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                {action == 'add' ? '新增' : '编辑'} 用户
            </Button>
            <Drawer
                title={title()}
                width={450}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={onClose}>取消</Button>
                        <SubmitButton form={form}>提交</SubmitButton>
                    </Space>
                }
            >
                <Form layout="vertical" hideRequiredMark
                    form={form}
                    validateMessages={{
                        required: '${label}为必填项',
                    }}
                    scrollToFirstError
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="username"
                                label="用户名"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入用户名" />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="password"
                                label="密码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码',
                                    },
                                ]}
                            >
                                <Input type='password' placeholder="请输入密码" />
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </Drawer>
        </>
    );
};
export default UserForm;