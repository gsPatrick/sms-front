'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Modal,
  Form,
  Select,
  Tag,
  Space,
  Typography,
  message,
  Tooltip,
  Spin
} from 'antd';
import {
  CreditCardOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  StopOutlined,
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import styles from './page.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface NewNumberFormData {
  service: string;
  country: string;
}

const DashboardPage: React.FC = () => {
  const {
    user,
    smsNumbers,
    services,
    countries,
    stats,
    loading,
    createSmsNumber,
    refreshSmsNumber,
    cancelSmsNumber,
    refreshData
  } = useApp();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  const handleCreateNumber = async (values: NewNumberFormData) => {
    try {
      await createSmsNumber(values.service, values.country);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  const handleRefreshNumber = async (id: string) => {
    try {
      await refreshSmsNumber(id);
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  const handleCancelNumber = async (id: string) => {
    try {
      await cancelSmsNumber(id);
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      waiting: { color: 'blue', text: 'Aguardando' },
      received: { color: 'green', text: 'Recebido' },
      expired: { color: 'red', text: 'Expirado' },
      cancelled: { color: 'default', text: 'Cancelado' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.waiting;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'Serviço',
      dataIndex: 'service',
      key: 'service',
      render: (service: string) => {
        const serviceData = services.find(s => s.id === service);
        return serviceData?.name || service;
      }
    },
    {
      title: 'País',
      dataIndex: 'country',
      key: 'country',
      render: (country: string) => {
        const countryData = countries.find(c => c.id === country);
        return countryData?.name || country;
      }
    },
    {
      title: 'Número',
      dataIndex: 'number',
      key: 'number',
      render: (number: string) => (
        <Text code>{number}</Text>
      )
    },
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        code ? <Text strong style={{ color: '#52c41a' }}>{code}</Text> : '-'
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: 'Custo',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => `R$ ${cost.toFixed(2)}`
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (record: any) => (
        <Space>
          {record.status === 'waiting' && (
            <>
              <Tooltip title="Atualizar">
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={() => handleRefreshNumber(record.id)}
                  size="small"
                />
              </Tooltip>
              <Tooltip title="Cancelar">
                <Button
                  type="text"
                  danger
                  icon={<StopOutlined />}
                  onClick={() => handleCancelNumber(record.id)}
                  size="small"
                />
              </Tooltip>
            </>
          )}
          {record.status === 'received' && (
            <Tooltip title="Ver código">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => message.info(`Código: ${record.code}`)}
                size="small"
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  if (loading.auth) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <Title level={2}>Dashboard</Title>
          <Text type="secondary">
            Gerencie seus números SMS e monitore suas verificações em tempo real.
          </Text>
        </div>

        {/* Estatísticas */}
        <Row gutter={[24, 24]} className={styles.statsRow}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Créditos Disponíveis"
                value={user?.credits || 0}
                prefix={<CreditCardOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Usados Hoje"
                value={stats.usedToday}
                prefix={<MessageOutlined style={{ color: '#1677ff' }} />}
                valueStyle={{ color: '#1677ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Taxa de Sucesso"
                value={stats.successRate}
                suffix="%"
                prefix={<CheckCircleOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Números Ativos"
                value={stats.activeNumbers}
                prefix={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Números SMS */}
        <Card 
          title="Números SMS"
          extra={
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={refreshData}
                loading={loading.smsNumbers}
              >
                Atualizar
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                loading={loading.newNumber}
              >
                Novo Número
              </Button>
            </Space>
          }
          className={styles.numbersCard}
        >
          <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
            Gerencie seus números virtuais e códigos recebidos
          </Text>
          
          <Table
            columns={columns}
            dataSource={smsNumbers}
            rowKey="id"
            loading={loading.smsNumbers}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} de ${total} números`
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Modal para novo número */}
        <Modal
          title="Solicitar Novo Número"
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={500}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateNumber}
            style={{ marginTop: 24 }}
          >
            <Form.Item
              name="service"
              label="Serviço"
              rules={[{ required: true, message: 'Selecione um serviço' }]}
            >
              <Select 
                placeholder="Escolha o serviço"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase())
                }
              >
                {services.map(service => (
                  <Option key={service.id} value={service.id}>
                    {service.name} - R$ {service.price.toFixed(2)}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="country"
              label="País"
              rules={[{ required: true, message: 'Selecione um país' }]}
            >
              <Select 
                placeholder="Escolha o país"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase())
                }
              >
                {countries.map(country => (
                  <Option key={country.id} value={country.id}>
                    {country.name} ({country.code}) - R$ {country.price.toFixed(2)}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}>
                  Cancelar
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={loading.newNumber}
                >
                  Solicitar Número
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default DashboardPage;

