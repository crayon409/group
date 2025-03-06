import { TreeSelect } from "antd";
import React, { useEffect, useState } from "react";
import http from "../utils/http";


const Category = ({ catId, actionCallback, withTop }) => {
    const [treeData, setTreeData] = useState([]);
    const dataMap = (data) => data.map((item) => {
        return {
            ...item,
            key: item.id,
            value: item.id,
            title: item.name,
            children: item.children && dataMap(item.children)
        }
    })

    useEffect(() => {
        http.post('/Category/index', { isAll: 1 }).then(res => {
            if (res['code'] == 0) {
                let first = withTop ? [{ id: 0, name: '顶级', title: '顶级', value: 0 }] : [];
                let data = [...first,
                ...res.data["list"]]
                setTreeData(dataMap(data));
            } else {
                alert(res.msg)
            }
        })
    }, []);
    const onPopupScroll = (e) => {
        console.log('onPopupScroll', e);
    };
    const onChangeParentId = (newValue) => {
        actionCallback && actionCallback(newValue)
        console.log('changenewval', newValue)
    };

    return (
        <div>
            <TreeSelect
                showSearch
                dropdownStyle={{
                    maxHeight: 400,
                    overflow: 'auto',
                }}
                value={catId}
                placeholder="请选择父级"
                allowClear
                treeDefaultExpandAll
                onChange={onChangeParentId}
                treeData={treeData}
                onPopupScroll={onPopupScroll}
            />
        </div>
    );
};

export default Category;