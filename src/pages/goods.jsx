import React, { useEffect, useState } from 'react';
import { Button, Col, message, Space, Table } from 'antd';
import GoodsForm from '../components/goods_form';
import http from '../utils/http';
import config from '../config/app';


const Goods = () => {
    const [dataSource, setDataSource] = useState([]);
    const [action, setAction] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [values, setValues] = useState({});

    useEffect(() => {
        http.post('/Goods/index', {})
            .then(res => {
                if (res['code'] == 0) {
                    setDataSource(res.data.list ?? [])
                } else {
                    message.error(res.msg)
                }
            })
    }, [refresh])
    const edit = (record) => {
        setOpen(true);
        setAction('edit');
        setValues(record);
        setRefresh(refresh + 1);
    }
    const del = (record) => {
        http.post('/Goods/del', { id: record.id })
            .then(res => {
                if (res.code == 0) {
                    setRefresh(refresh + 1)
                    message.success("删除成功")

                } else {
                    message.error(res.msg)
                }
            })
    }

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '分类',
            dataIndex: 'catName',
        },
        {
            title: '主图',
            dataIndex: 'picture',
            render: (text, record) => {
                return record?.picture ?
                    <img src={(record.picture[0].substr(0, 4) === 'http' || record.picture[0].substr(0, 5) === 'https')
                        ? record.picture[0]
                        : config.api.fileUrl + record.picture[0]
                    }
                        alt=""
                        style={{ width: '100px' }} />
                    : null
            },
        },
        {
            title: '简介',
            dataIndex: 'desc',
        },
        {
            title: '原价',
            dataIndex: 'originPrice',
        },
        {
            title: '售价',
            dataIndex: 'shopPrice',
        },
        {
            title: '操作',
            width: 120,
            fixed: 'right',
            render: (record) => {
                return (
                    <Space>
                        <Button type='primary' onClick={() => edit(record)}>编辑</Button>
                        <Button type='primary' danger onClick={() => del(record)}>删除</Button>
                    </Space>
                )
            }
        },
    ];


    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const [open, setOpen] = useState(false);

    useEffect(() => {
        console.log(open);
    }, [open]);

    return (<Col span={24}>
        <Space size='small' direction='vertical'>
            <GoodsForm
                action={action}
                setAction={setAction}
                open={open}
                setOpen={setOpen}
                refresh={refresh}
                setRefresh={setRefresh}
                values={values}
                setValues={setValues}
            />
        </Space>
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
        />
    </Col>
    );
};
export default Goods;