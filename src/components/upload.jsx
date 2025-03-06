import React, { useEffect, useState } from 'react';
import config from '../config/app';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const Uploads = ({ maxLen, values, setValues, actionCallback }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChange = ({ fileList: newFileList }) => {
        actionCallback(newFileList.filter(item => item.status === 'done'));
        setValues(newFileList)
        console.log('fileList', newFileList)
    }

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                上传
            </div>
        </button>
    );
    return (
        <>
            <Upload
                accept='image/*'
                action={config.api.baseUrl + '/Base/uploadFile'}
                listType="picture-card"
                headers={{
                    "x-token": localStorage.getItem('token'),
                }}
                fileList={values}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {values.length >= maxLen ? null : uploadButton}
            </Upload >
            {previewImage && (
                <Image
                    wrapperStyle={{
                        display: 'none',
                    }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )
            }
        </>
    );
};
export default Uploads;