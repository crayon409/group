import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Image } from 'antd';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import './login.css';
import httpClient from '../utils/http';

const Login = () => {

    const [form] = Form.useForm();
    const [captcha, setCaptcha] = useState(null);
    const navigate = useNavigate(); // 使用 useNavigate 钩子
    const getCaptcha = () => {
        httpClient.post('/Base/captcha')
            .then(res => {
                setCaptcha(res.data.picPath);
                form.setFieldsValue({ captchaId: res.data.captchaId });
                console.log(form.getFieldsValue())
            })
            .catch(res => {
                console.log(res)
            });

    };
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/home'); // 如果已经登录，直接跳转到 /home 路由
            return;
        }

        getCaptcha();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onFinish = (values) => {
        console.log(values)
        httpClient.post('/Base/login', values)
            .then(res => {
                console.log(res.data)
                if (res.code === 0) {
                    localStorage.setItem('token', res.data.token);
                    navigate('/home'); // 登录成功后跳转到 /home 路由
                    return
                }
                getCaptcha();

            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (<div className='login-box'>
        <div className="login-filter"></div>
        <div className='login-padding'></div>
        <div className='form-container'>
            <div className='form-box'>
                <h1>社区团购管理系统</h1>
                <Form
                    name="login"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={form} // 将 form 实例传递给 Form 组件
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="验证码"
                        name="captcha"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码!',
                            },
                        ]}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Input style={{ flex: 1 }} />
                            <Image src={captcha} preview={false} width={120} height={32} style={{ marginLeft: 8 }}
                                onClick={getCaptcha} />
                        </div>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>

                    {/* 添加隐藏的 captchaId 字段 */}
                    <Form.Item name="captchaId" hidden>
                        <Input type="hidden" />
                    </Form.Item>
                </Form>
            </div>
        </div>
    </div >)
};
export default Login;