import React from 'react';
import { useRef, useState } from 'react';
import { Button, Tabs } from 'antd';
const defaultPanes = new Array(2).fill(null).map((_, index) => {
    const id = String(index + 1);
    return {
        label: `Tab ${id}`,
        children: `Content of Tab Pane ${index + 1}`,
        key: id,
    };
});
const TabsContent = () => {
    const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
    const [items, setItems] = useState(defaultPanes);
    const newTabIndex = useRef(0);
    const onChange = (key) => {
        setActiveKey(key);
    };
    const add = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        setItems([
            ...items,
            {
                label: 'New Tab',
                children: 'New Tab Pane',
                key: newActiveKey,
            },
        ]);
        setActiveKey(newActiveKey);
    };
    const remove = (targetKey) => {
        const targetIndex = items.findIndex((pane) => pane.key === targetKey);
        const newPanes = items.filter((pane) => pane.key !== targetKey);
        if (newPanes.length && targetKey === activeKey) {
            const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
            setActiveKey(key);
        }
        setItems(newPanes);
    };
    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };
    return (
        <div style={{
        }}>
            <div >
                <Button onClick={add}>ADD</Button>
            </div>
            <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={items}
            />
        </div>
    );
};
export default TabsContent;