import React, { useEffect, useState } from 'react';
import { Button, message, Space, Table } from 'antd';
import http, { params } from '../utils/http';
import CategoryForm from '../components/category_form';

const CategoryList = () => {
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const [action, setAction] = useState('add');
    const [values, setValues] = useState({});
    const [show, setShow] = useState(false);

    const edit = (record) => {
        setValues(submitData(record));
        setAction('edit');
        setShow(true)
    };

    const submitData = (record) => {
        return {
            id: record.id,
            name: record.name,
            parentId: record.parentId,
        }
    }
    const del = (record) => {
        http.post('/Category/del', { id: record.id })
            .then(res => {
                if (res.code == 0) {
                    setRefresh(refresh + 1)
                } else {
                    message.error(res.msg)
                }
            })
    };

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: '添加时间',
            dataIndex: 'createdAt',
            key: 'createdAt',

        },
        {
            title: '操作',
            width: 120,
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type='primary' onClick={() => edit(record)}>编辑</Button>
                    <Button type='primary' onClick={() => del(record)} >删除</Button>
                </Space >
            ),
        },
    ];

    useEffect(() => {
        const dataMap = (data) => {
            return data.map((item) => {
                let ch;
                if (item.children && item.children.length > 0) {
                    ch = dataMap(item.children)
                } else {
                    ch = [];
                }
                return {
                    ...item,
                    key: item.id,
                    value: item.id,
                    title: item.name,
                    children: ch,
                }
            })
        }
        http.post('/Category/index', {
            ...params, ...{
                page: page,
                pageSize: pageSize,
            }
        })
            .then(res => {
                if (res['code'] == 0) {
                    setTotal(res.data["count"]);
                    let d = dataMap(res.data["list"])
                    console.log(d);
                    setData(d);
                } else {
                    alert(res.msg)
                }
            })
    }, [page, pageSize, refresh]);

    return <>
        <Space style={{
            marginBottom: 16,
        }}>
            <CategoryForm
                setAction={setAction}
                action={action}
                refresh={refresh}
                setRefresh={setRefresh}
                values={values}
                open={show}
                setOpen={setShow}
            />
        </Space>
        <Table
            columns={columns}
            dataSource={data}
            expandable={{
                expandable: {
                    rowExpandable: (record) => record.children && record.children.length > 0,
                },
            }}
            pagination={{
                pageSize: pageSize,
                total: total,
                showTotal: (total, range) => `共 ${total} 条数据`,
                showQuickJumper: true,
                onChange: (page, pageSize) => {
                    setPage(page)
                    setPageSize(pageSize)
                },
            }}
        />
    </>;
}
export default CategoryList;