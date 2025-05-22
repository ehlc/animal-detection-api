/* eslint-disable no-debugger */
import React, { useState } from 'react';
import {
  Layout,
  Upload,
  Modal,
  Row,
  Col,
  Card,
  Empty,
  Typography,
  Space,
  Button,
} from 'antd';
import {
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
  InboxOutlined,
} from '@ant-design/icons';


const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function Main() {
  const [images, setImages] = useState([]); // { uid, name, url }[]
  const [preview, setPreview] = useState({ open: false, currentIndex: 0 });

  const customUpload = ({ file, onSuccess }) => {
    const reader = new FileReader();
    reader.onload = () => onSuccess({ url: reader.result });
    reader.readAsDataURL(file);
  };

  const handleUploadChange = ({ fileList }) => {
    const newImages = fileList
      .filter((f) => f.status === 'done')
      .map((f) => ({
        uid: f.uid,
        name: f.name,
        url: f.response.url,
      }));
    setImages(newImages);
  };

  const showPreview = (idx) =>
    setPreview({ open: true, currentIndex: idx });

  const closePreview = () =>
    setPreview((prev) => ({ ...prev, open: false }));

  const prevImage = () =>
    setPreview((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex - 1,
    }));

  const nextImage = () =>
    setPreview((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
    }));

  const currentImg = images[preview.currentIndex] || {};

return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Header
            style={{
                background: '#fff',
                borderBottom: '1px solid #e8e8e8',
                padding: '0 24px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '64px',
                }}
            >
                <Title level={3} style={{ margin: 0 }}>
                    Detección y Conteo de Animales en Manadas Densas
                </Title>
                <Text type="secondary">Sube y Procesa Tus Imágenes</Text>
            </div>
        </Header>

        <Content style={{ padding: '14px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>

                <div style={{ display: 'flex', padding: 24, background: '#fff', borderRadius: 8 }}>



                      <div style={{ flex: 2 }}>
                        <Dragger
                            accept="image/*"
                            multiple
                            customRequest={customUpload}
                            listType="picture"
                            showUploadList={false}
                            onChange={handleUploadChange}
                            style={{
                                background: '#fff',
                                padding: '5px',
                                borderRadius: 8,
                                border: '1px dashed #d9d9d9',
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Haz clic o arrastra archivos de imagen a esta área para procesarlos
                            </p>

                        </Dragger>

                    </div>

                </div>
            

                {images.length === 0 ? (
                    <Empty description="No se han procesado imágenes aún." />
                ) : (
                    <>
                    
                        <Row gutter={[16, 16]}>
                            {images.map((img, idx) => (
                                <Col key={img.uid} xs={24} sm={12} md={12} lg={6}>
                                    <Card
                                        hoverable
                                        onClick={() => showPreview(idx)}
                                        style={{
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}
                                        cover={
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: 160,
                                                    background: '#f5f5f5',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <img
                                                    alt={img.name}
                                                    src={img.url}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'contain',
                                                    }}
                                                />
                                            </div>
                                        }
                                    >
                                        <Card.Meta
                                            title={
                                                <span
                                                    style={{
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden',
                                                        display: 'block',
                                                        maxWidth: '100%',
                                                    }}
                                                >
                                                    {img.name}
                                                </span>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </Space>

            <Modal
                open={preview.open}
                title={currentImg.name}
                footer={[
                    <Button
                        key="prev"
                        icon={<LeftOutlined />}
                        onClick={prevImage}
                        disabled={preview.currentIndex === 0}
                    />,
                    <Button
                        key="next"
                        icon={<RightOutlined />}
                        onClick={nextImage}
                        disabled={preview.currentIndex === images.length - 1}
                    />,
                ]}
                onCancel={closePreview}
                
            >
                <img
                    alt={currentImg.name}
                    src={currentImg.url}
                    style={{ maxWidth: '100%', maxHeight: '70vh' }}
                />
                Cantidad: 50 <br />
                Categoría 1: 20 <br />
                Categoría 2: 30
            </Modal>
        </Content>
    </Layout>
);
}
