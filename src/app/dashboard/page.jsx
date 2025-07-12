'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Modal, Form, Select, Tag, Space, Typography, message, Tooltip, Spin } from 'antd';
import { CreditCardOutlined, MessageOutlined, CheckCircleOutlined, ClockCircleOutlined, PlusOutlined, ReloadOutlined, StopOutlined, EyeOutlined } from '@ant-design/icons';
// import Layout from '@/components/Layout'; // <-- REMOVIDO
import { useApp } from '@/contexts/AppContext';
import styles from './page.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

const DashboardPage = () => {
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

    // Hook para atualizar dados periodicamente (opcional, mas bom ter)
    useEffect(() => {
        // Atualizar dados a cada 30 segundos
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') { // Só atualiza se a aba estiver visível
                refreshData();
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [refreshData]);

    const handleCreateNumber = async (values) => {
        try {
            await createSmsNumber(values.service, values.country);
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            // Erro já é tratado no AppContext, então não precisa fazer nada aqui.
        }
    };

    const handleRefreshNumber = async (id) => {
        try {
            // A lógica de reativação foi ajustada no AppContext
            await refreshSmsNumber(id);
        } catch (error) {
            // Erro tratado no AppContext
        }
    };
    
    const handleCheckStatus = async (id) => {
        // Esta função pode ser implementada se você precisar de uma verificação de status manual
        // Por enquanto, a reativação é o principal. A verificação pode ser um GET para /sms/status/:id
        message.info("Funcionalidade de verificação de status manual em desenvolvimento.");
    };

    const handleCancelNumber = async (id) => {
        try {
            await cancelSmsNumber(id);
        } catch (error) {
            // Erro tratado no AppContext
        }
    };

    const getStatusTag = (status) => {
        const statusConfig = {
            waiting: { color: 'blue', text: 'Aguardando' },
            active: { color: 'blue', text: 'Aguardando' }, // Mapeando 'active' para a mesma tag
            received: { color: 'green', text: 'Recebido' },
            completed: { color: 'green', text: 'Recebido' }, // Mapeando 'completed' para a mesma tag
            expired: { color: 'red', text: 'Expirado' },
            cancelled: { color: 'default', text: 'Cancelado' }
        };
        const config = statusConfig[status] || { color: 'gold', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
        {
            title: 'Serviço',
            dataIndex: 'sms_service_id', // O backend retorna sms_service_id
            key: 'service',
            render: (serviceId) => {
                // CORRIGIDO: O backend retorna o objeto do serviço aninhado
                const service = services.find(s => s.id === serviceId);
                return service ? service.name : 'Desconhecido';
            }
        },
        {
            title: 'País',
            dataIndex: 'country_code', // O backend retorna country_code
            key: 'country',
            render: (countryCode) => {
                // NOTA: A lista de países não vem da API. Isso pode não funcionar como esperado.
                const country = countries.find(c => c.id === countryCode);
                return country ? `${country.flag} ${country.name}` : countryCode || 'Global';
            }
        },
        {
            title: 'Número',
            dataIndex: 'phone_number', // O backend retorna phone_number
            key: 'number',
            render: (number) => (<Text code copyable>{number}</Text>)
        },
        {
            title: 'Código',
            dataIndex: 'last_message', // O backend não envia o código diretamente na lista de números.
            key: 'code',
            render: (code) => (code ? <Text strong style={{ color: '#52c41a' }}>{code}</Text> : '-')
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status)
        },
        {
            title: 'Custo (Créditos)',
            dataIndex: 'cost',
            key: 'cost',
            render: (cost) => cost // O custo já vem formatado pelo backend
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'active' && (
                        <>
                            <Tooltip title="Reativar para outro SMS">
                                <Button type="text" icon={<ReloadOutlined />} onClick={() => handleRefreshNumber(record.id)} size="small" />
                            </Tooltip>
                            <Tooltip title="Cancelar Número">
                                <Button type="text" danger icon={<StopOutlined />} onClick={() => handleCancelNumber(record.id)} size="small" />
                            </Tooltip>
                        </>
                    )}
                    {record.status === 'completed' && (
                        <Tooltip title="Ver código">
                            <Button type="text" icon={<EyeOutlined />} onClick={() => message.info(`Código: ${record.last_message}`)} size="small" />
                        </Tooltip>
                    )}
                </Space>
            )
        }
    ];
    
    // Spinner de carregamento enquanto autentica
    if (loading.auth) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 134px)' }}>
                <Spin size="large" />
            </div>
        );
    }
    
    // REMOVIDO: A tag <Layout> que envolvia todo o retorno.

    return (
        <div className={styles.container}>
            <div className="container"> {/* Adicionando um container para centralizar */}
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
                            <Statistic title="Créditos Disponíveis" value={user?.credits || 0} prefix={<CreditCardOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic title="Total Gasto" value={stats.totalSpent} prefix="R$" valueStyle={{ color: '#1677ff' }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic title="Taxa de Sucesso" value={stats.successRate} suffix="%" prefix={<CheckCircleOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic title="Números Ativos" value={stats.activeNumbers} prefix={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />} valueStyle={{ color: '#ff4d4f' }} />
                        </Card>
                    </Col>
                </Row>

                {/* Números SMS */}
                <Card 
                    title="Números SMS Ativos" 
                    extra={
                        <Space>
                            <Button icon={<ReloadOutlined />} onClick={refreshData} loading={loading.smsNumbers || loading.stats}>
                                Atualizar
                            </Button>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} loading={loading.newNumber}>
                                Novo Número
                            </Button>
                        </Space>
                    } 
                    className={styles.numbersCard}
                >
                    <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                        Gerencie seus números virtuais e códigos recebidos. Os números expiram após 2 minutos se nenhum SMS for recebido.
                    </Text>
                    
                    <Table 
                        columns={columns} 
                        dataSource={smsNumbers} 
                        rowKey="id" 
                        loading={loading.smsNumbers} 
                        pagination={{ pageSize: 10, showSizeChanger: false }}
                        scroll={{ x: 800 }}
                    />
                </Card>

                {/* Modal para novo número */}
                <Modal 
                    title="Solicitar Novo Número" 
                    open={isModalVisible} 
                    onCancel={() => { setIsModalVisible(false); form.resetFields(); }} 
                    footer={null} 
                    width={500}
                >
                    <Form form={form} layout="vertical" onFinish={handleCreateNumber} style={{ marginTop: 24 }}>
                        <Form.Item name="service" label="Serviço" rules={[{ required: true, message: 'Selecione um serviço' }]}>
                            <Select placeholder="Escolha o serviço" size="large" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                                {services.map(service => (
                                    <Option key={service.code} value={service.code}>
                                        {`${service.name} - ${service.price_per_otp} créditos`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="country" label="País (Opcional)">
                            <Select placeholder="Qualquer país (padrão)" size="large" showSearch allowClear filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                                {countries.map(country => (
                                    <Option key={country.id} value={country.id}>
                                        {`${country.flag} ${country.name}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div style={{ textAlign: 'right', marginTop: 24 }}>
                            <Space>
                                <Button onClick={() => { setIsModalVisible(false); form.resetFields(); }}>
                                    Cancelar
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading.newNumber}>
                                    Solicitar Número
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default DashboardPage;