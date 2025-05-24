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
  Spin,
  Button,
} from 'antd';
import { PlusOutlined, LeftOutlined, RightOutlined, InboxOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Dragger } = Upload;

const FullScreenLoader = () => (
  <div style={overlayStyle}>
    <Spin size="large" tip="Loading..." />
  </div>
);

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function Main() {
  const [images, setImage] = useState([]);
  const [preview, setPreview] = useState({ open: false, currentIndex: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('1');

  const tabData = [
    {
      key: '1',
      label: 'HerdNet',
      endpoint: 'https://jzuezmhit2.us-east-1.awsapprunner.com/predict',
      model: 'herdnet',
    },
    {
      key: '2',
      label: 'Mask R-CNN',
      endpoint: 'https://jzuezmhit2.us-east-1.awsapprunner.com/predict',
      model: 'maskrcnn',
    },
    {
      key: '3',
      label: 'DETR',
      endpoint: 'https://jzuezmhit2.us-east-1.awsapprunner.com/predict',
      model: 'detr',
    },
  ];

  const classColors = [
    {
      color: '(255, 0, 0)',
      label: 'Rojo',
      animal: 'Top',
    },
    {
      color: '(0, 255, 0)',
      label: 'Verde',
      animal: 'Buffalo',
    },
    {
      color: '(0, 0, 255)',
      label: 'Azul',
      animal: 'Kob',
    },
    {
      color: '(255, 255, 0)',
      label: 'Amarillo',
      animal: 'Warthog',
    },
    {
      color: '(255, 0, 255)',
      label: 'Magenta',
      animal: 'Warthog',
    },
    {
      color: '(0, 255, 255)',
      label: 'Cian',
      animal: 'Elephant',
    },
    {
      color: '(128, 0, 128)',
      label: 'Púrpura',
      animal: 'Fondo imagen',
    },
  ];

  const customUpload = ({ file, onSuccess }) => {
    const reader = new FileReader();
    reader.onload = () => onSuccess({ url: reader.result });
    reader.readAsDataURL(file);
  };

  const handleUploadChange = async ({ fileList }) => {
    setLoading(true);

    const file = fileList[fileList.length - 1];

    if (file.status === 'done' && file.originFileObj) {
      const formData = new FormData();

      const tabDataItem = tabData.find((tab) => tab.key === selectedTab);

      formData.append('file', file.originFileObj, file.name);
      formData.append('model', tabDataItem?.model);

      const endpoint = tabDataItem?.endpoint;

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          redirect: 'follow',
        });

        const jsonData = await res.json();

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} – ${res.statusText}`);
        }

        console.log('Parsed JSON:', jsonData);

        setLoading(false);

        setImage([
          ...images,
          {
            uid: file.uid,
            name: file.name,
            url: jsonData.url,
            model: tabData.find((tab) => tab.key === selectedTab)?.label,
            data: jsonData,
          },
        ]);
      } catch (err) {
        console.error('Upload failed:', err);
        setLoading(false);
      }
    }
  };

  const showPreview = (idx, img) => {
    images[idx].data = img.data;
    setImage([...images]);
    setPreview({ open: true, currentIndex: idx, data: img.data });
  };

  const closePreview = () => setPreview((prev) => ({ ...prev, open: false }));

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

  const tableStyle = {
    display: 'inline-block',
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden',
    fontFamily: 'Arial, sans-serif',
    width: '100%',
  };

  // Row styling
  const headerRowStyle = {
    display: 'flex',
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  };
  const rowStyle = {
    display: 'flex',
    borderTop: '1px solid #eee',
  };

  // Cell styling
  const cellStyle = {
    flex: 1,
    padding: '8px',
    borderRight: '1px solid #eee',
    textAlign: 'center',
  };
  const lastCellStyle = {
    ...cellStyle,
    borderRight: 'none',
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {loading && <FullScreenLoader />}
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
      <Tabs
        defaultActiveKey="1"
        onChange={(key) => setSelectedTab(key)}
        style={{
          padding: '0 24px',
        }}
        items={[
          {
            key: '1',
            label: 'HerdNet',
            children: <Space direction="vertical" size="large" style={{ width: '100%' }}></Space>,
          },
          {
            key: '2',
            label: 'Mask R-CNN',
            children: <div></div>,
          },
          {
            key: '3',
            label: 'DETR',
            children: <div></div>,
          },
        ]}
      />
      <div
        style={{
          background: '#f0f2f5',
          borderBottom: '1px solid #e8e8e8',
          borderTop: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 24px',
          fontWeight: 'bold',
        }}
      >
        Inferencias con modelo: {tabData.find((tab) => tab.key === selectedTab)?.label}
      </div>
      <Content style={{ padding: '0 14px 14px 14px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', padding: 24, background: '#fff', borderRadius: 8 }}>
            <div style={{ flex: 2 }}>
              <Dragger
                accept="image/jpeg,.jpg,.jpeg"
                multiple={false}
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
                      onClick={() => showPreview(idx, img)}
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
          Modelo: <b>{currentImg.model}</b> <br />
          <br />
          Cantidad:{' '}
          <span style={{ fontWeight: 'bold' }}>
            {images[preview.currentIndex]?.data?.inferences?.reduce(
              (sum, item) => sum + item.count,
              0,
            )}{' '}
          </span>
          <br />
          <br />
          <div style={tableStyle}>
            {/* Header */}
            <div style={headerRowStyle}>
              <div style={cellStyle}>Class ID</div>
              <div style={cellStyle}>Color</div>
              <div style={cellStyle}>Animal</div>
              <div style={lastCellStyle}>Conteo</div>
            </div>

            {/* Data rows */}
            {images[preview.currentIndex]?.data?.inferences?.map((item, idx) => {
              const color = `rgb${classColors[item.class_id].color}`;
              return (
                <div key={idx} style={rowStyle}>
                  <div style={cellStyle}>{item.class_id}</div>
                  <div style={{ ...cellStyle, color, fontWeight: 'bold' }}>
                    {classColors[item.class_id].label}
                  </div>
                  <div style={cellStyle}>{classColors[item.class_id].animal}</div>
                  <div style={lastCellStyle}>{item.count}</div>
                </div>
              );
            })}
          </div>
        </Modal>
      </Content>
    </Layout>
  );
}
