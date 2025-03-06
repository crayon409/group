import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, message, Row, Space, TreeSelect } from 'antd';
import http from '../utils/http';
import { use } from 'react';
const CategoryForm = ({ action, setAction, refresh, setRefresh, values, open, setOpen }) => {
    const [form] = Form.useForm();
    const [postvalues, setPostvalues] = useState(values);
    console.log("values", values, "postvalues", postvalues)
    useEffect(() => {
        setOpen(open)
    }, [open]);
    useEffect(() => {
        form.setFieldsValue(values)
        setPostvalues(values)
    }, [values]);
    const addCategory = () => {
        setAction('add');
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const SubmitBtn = ({ form, children }) => {
        const [submittable, setSubmittable] = useState(false);
        const onSubmit = () => {
            if (action == 'add') {
                http.post('/Category/add', form.getFieldsValue())
                    .then(res => {
                        if (res['code'] != 0) {
                            alert(res.msg)
                            return
                        }
                        setOpen(false)
                        setRefresh(refresh + 1);
                        form.resetFields();
                    })
                    .catch(res => {
                        message.error('网络错误')
                    })
            } else {
                http.post('/Category/edit', postvalues)
                    .then(res => {
                        if (res.code == 0) {
                            setRefresh(refresh + 1)
                            setOpen(false)
                        } else {
                            message.error(res.msg)
                        }
                    })
            }

        };
        // Watch all values
        const values = Form.useWatch([], form);
        useEffect(() => {
            form.validateFields({
                validateOnly: true,
            })
                .then(() => {
                    setSubmittable(true)
                })
                .catch(() => setSubmittable(false));
        }, [form, values]);

        return (
            <Button type="primary"
                htmlType="submit"
                disabled={!submittable}
                onClick={onSubmit} >
                {children}
            </Button>
        );
    };

    const onChangeParentId = (newValue) => {
        let data = { ...form.getFieldsValue(), parentId: newValue }

        form.setFieldsValue(data)
        console.log('newvalue', newValue);
        setPostvalues(data)
    };
    const onPopupScroll = (e) => {
        console.log('onPopupScroll', e);
    };
    const dataMap = (data) => data.map((item) => {
        return {
            ...item,
            key: item.id,
            value: item.id,
            title: item.name,
            children: item.children && dataMap(item.children)
        }
    })

    const titleDesc = (action == 'add' ? '新增' : '编辑') + '分类'
    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        http.post('/Category/index', { isAll: 1 }).then(res => {
            if (res['code'] == 0) {
                let data = [{ id: 0, name: '顶级', title: '顶级', value: 0 },
                ...res.data["list"]]
                setTreeData(dataMap(data));
            } else {
                alert(res.msg)
            }
        })
    }, [action, values]);

    return (
        <>
            <Button type="primary" onClick={addCategory} icon={<PlusOutlined />}>
                新增分类
            </Button>
            <Drawer
                title={titleDesc}
                width={450}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={<Space>
                    <Button onClick={onClose}>取消</Button>
                    <SubmitBtn form={form}>提交</SubmitBtn>
                </Space>}
            >
                <Form layout="vertical" hideRequiredMark
                    form={form}
                    validateMessages={{
                        required: '${label}为必填项',
                    }}
                    scrollToFirstError
                >
                    <Form.Item name='id' hidden><Input type='hidden' /></Form.Item>
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
                    <Form.Item
                        name="parentId"
                        label="父级分类"
                    >
                        <TreeSelect
                            showSearch
                            dropdownStyle={{
                                maxHeight: 400,
                                overflow: 'auto',
                            }}
                            placeholder="请选择父级"
                            allowClear
                            treeDefaultExpandAll
                            onChange={onChangeParentId}
                            treeData={treeData}
                            onPopupScroll={onPopupScroll}
                        />
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};
export default CategoryForm;