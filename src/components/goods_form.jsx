import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, message, Row, Select, Space, TreeSelect } from 'antd';
const { Option } = Select;
import Upload from './upload';
import Category from './category';
import http from '../utils/http';
import config from '../config/app';


const GoodsForm = ({ action, setAction, refresh, setRefresh, values, setValues, open, setOpen }) => {
    const [form] = Form.useForm();
    const addGoods = () => {
        setAction('add');
        setOpen(true);
        setValues({})
    };
    const titleDesc = (action == 'add' ? '新增' : '编辑') + '商品';

    const [submitable, setSubmittable] = useState(false);
    const [fileList, setFileList] = useState([]);
    const values2 = Form.useWatch([], form);

    useEffect(() => {
        form.validateFields({
            validateOnly: true,
        })
            .then(() => setSubmittable(true))
            .catch((err) => {
                console.log(err);
                setSubmittable(false)
            });
    }, [form, values2])

    useEffect(() => {
        console.log('values', values)
        if (action == 'add') {
            form.resetFields()
            setFileList([])
        } else {
            form.setFieldsValue(values)
            setTimeout(() => {
                setFileList(values?.picture ? values.picture.map((item, idx) => ({
                    uid: idx + '',
                    name: item,
                    status: 'done',
                    url: config.api.fileUrl + item,
                })) : [])
            }, 500);
        }
    }, [action])

    useEffect(() => {
        console.log('fileList', fileList)
    }, [fileList])

    const submitGoods = () => {
        if (action == 'add') {
            http.post('/Goods/add', form.getFieldsValue())
                .then(res => {
                    if (res.code != 0) {
                        message.error(res.msg)
                        return
                    }
                    message.success('添加成功')
                    setRefresh(refresh + 1)
                    form.resetFields()
                    setValues({})
                    setOpen(false)
                })
                .catch(res => {
                    message.error('网络错误')
                })
        } else {
            http.post('/Goods/edit', form.getFieldsValue())
                .then(res => {
                    if (res.code != 0) {
                        message.error(res.msg)
                        return
                    }
                    message.success('修改成功')
                    setRefresh(refresh + 1)
                    setOpen(false)
                })
                .catch(res => {
                    message.error('网络错误')
                })
        }
        console.log('submit', form.getFieldsValue());
    };

    const onClose = () => {
        setOpen(false);
    };

    const uploadCallback = (newValue) => {
        console.log('newValue', newValue)
        form.setFieldsValue({
            picture: newValue.map(element => element.response?.data?.file_name
                ? element.response?.data?.file_name
                : element.url
            )
        })
    }

    return (
        <>
            <Button type="primary" onClick={addGoods} icon={<PlusOutlined />}>
                添加商品
            </Button>
            <Drawer
                title={titleDesc}
                width={900}
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
                        <Button disabled={!submitable} onClick={submitGoods} type="primary">
                            提交
                        </Button>
                    </Space>
                }
            >
                <Form
                    layout="vertical"
                    form={form}
                    scrollToFirstError
                    validateMessages={{
                        required: '${label}为必填项',
                    }}
                >
                    <Form.Item name='id' hidden>
                        <Input hidden />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入名称',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入名称" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="catId"
                                label="分类"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择分类',
                                    },
                                ]}
                            >
                                <Category
                                    actionCallback={(val) => {
                                        form.setFieldsValue({
                                            ...form.getFieldsValue(),
                                            catId: val
                                        })
                                        setValues({ ...values, catId: val })
                                    }}
                                    catId={values?.catId}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="originPrice"
                                label="原价"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入原价',
                                    },
                                ]}
                            >
                                <Input placeholder='请输入原价' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="shopPrice"
                                label="售价"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入售价',
                                    },
                                ]}
                            >
                                <Input placeholder='请输入售价' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>

                        {/* <Col span={12}>
                            <Form.Item
                                name="dateTime"
                                label="DateTime"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please choose the dateTime',
                                    },
                                ]}
                            >
                                <DatePicker.RangePicker
                                    style={{
                                        width: '100%',
                                    }}
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                />
                            </Form.Item>
                        </Col> */}
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="picture"
                                label="商品图片"
                                rules={[
                                    {
                                        required: true,
                                        message: '请上传商品图片',
                                    },
                                ]}
                            >
                                <Upload
                                    maxLen='9'
                                    values={fileList}
                                    setValues={setFileList}
                                    actionCallback={uploadCallback}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="desc"
                                label="简介"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入商品简介',
                                    },
                                ]}
                            >
                                <Input.TextArea rows={4} placeholder="请输入商品简介" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};
export default GoodsForm;