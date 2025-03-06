import React, { useEffect, useState } from 'react';
import { Col, Flex, Form, Table, Typography } from 'antd';
import UserForm from '../components/user_form';
import httpClient from '../utils/http';

const EditableCell = ({
    children,
    ...restProps
}) => {
    return (
        <td {...restProps}>
            {children}
        </td>
    );
};
const UserList = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const del = (record) => {
        httpClient.get('/User/del?id=' + record.id)
            .then(res => {
                if (res.code == 0) {
                    setRefresh(refresh + 1)
                }
            })
    };

    useEffect(() => {
        let param = {
            page: page,
            pageSize: pageSize,
        }
        httpClient.post('/User/index', param)
            .then(res => {
                if (res['code'] == 0) {
                    setTotal(res.data["count"]);
                    setData(res.data["list"]);
                } else {
                    alert(res.msg)
                }
            })
    }, [page, pageSize, refresh]);


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '5%',
            editable: true,
        },
        {
            title: '用户名',
            dataIndex: 'nickname',
            width: '40%',
            editable: true,
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            width: '40%',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) => {
                return (
                    <Typography.Link onClick={() => del(record)}>
                        删除
                    </Typography.Link >
                );
            },
        },
    ];

    return (
        <Form form={form} component={false}>
            <Flex vertical gap="small" >
                <Col span={6} >
                    <UserForm action="add"
                        refresh={refresh}
                        setRefresh={setRefresh}></UserForm>
                </Col>
                <Col span={24} >
                </Col>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={{
                        pageSize: pageSize,
                        current: page,
                        total: total,
                        onChange: (page, pageSize) => {
                            setPage(page);
                            setPageSize(pageSize);
                        },
                    }}
                    style={{ width: '100%' }}
                />
            </Flex>
        </Form>
    );
};
export default UserList;