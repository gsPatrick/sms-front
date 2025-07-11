'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Radio,
  Modal,
  Form,
  Input,
  Select,
  Divider,
  Space,
  Alert,
  Badge,
  Spin
} from 'antd';
import {
  CreditCardOutlined,
  SafetyOutlined,
  StarFilled,
  CheckOutlined,
  QrcodeOutlined,
  BankOutlined
} from '@ant-design/icons';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import styles from './page.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

const BuyCreditsPage: React.FC = () => {
  const { creditPackages, purchaseCredits, loading } = useApp();
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('pix');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const paymentMethods = [
    {
      id: 'pix',
      name: 'PIX',
      icon: <QrcodeOutlined />,
      discount: 5,
      description: 'Aprovação instantânea'
    },
    {
      id: 'credit_card',
      name: 'Cartão de Crédito',
      icon: <CreditCardOutlined />,
      discount: 0,
      description: 'Parcelamento disponível'
    }
  ];

  const handlePurchase = () => {
    if (!selectedPackage) {
      return;
    }
    setIsModalVisible(true);
  };

  const handlePayment = async (values?: PaymentFormData) => {
    try {
      const paymentData = paymentMethod === 'credit_card' ? values : undefined;
      await purchaseCredits(selectedPackage, paymentMethod, paymentData);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  const getPackagePrice = (pkg: any) => {
    if (!pkg) return 0;
    if (paymentMethod === 'pix' && pkg.price) {
      return pkg.price * 0.95; // 5% desconto no PIX
    }
    return pkg.price || 0;
  };

  const selectedPkg = creditPackages.find(p => p.id === selectedPackage);
  const selectedPayment = paymentMethods.find(p => p.id === paymentMethod);

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
          <Title level={2}>Comprar Créditos</Title>
          <Text type="secondary">
            Escolha o pacote ideal para suas necessidades. Todos os planos incluem acesso completo à nossa API e suporte especializado.
          </Text>
        </div>

        {/* Segurança */}
        <Alert
          message="Pagamento 100% Seguro"
          description="Seus dados estão protegidos com criptografia SSL e não armazenamos informações de cartão."
          type="info"
          icon={<SafetyOutlined />}
          showIcon
          style={{ marginBottom: 32 }}
        />

        {/* Pacotes de Créditos */}
        <Row gutter={[24, 24]} className={styles.packagesRow}>
          {creditPackages.map((pkg) => (
            <Col xs={24} sm={12} lg={6} key={pkg.id}>
              <Badge.Ribbon 
                text={pkg.popular ? "MAIS POPULAR" : undefined}
                color={pkg.popular ? "gold" : undefined}
                style={{ display: pkg.popular ? 'block' : 'none' }}
              >
                <Card
                  className={`${styles.packageCard} ${selectedPackage === pkg.id ? styles.selected : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                  hoverable
                >
                  <div className={styles.packageHeader}>
                    <Title level={4}>{pkg.name}</Title>
                    <div className={styles.packagePrice}>
                      <Text strong style={{ fontSize: '24px' }}>
                        R$ {pkg.price.toFixed(2)}
                      </Text>
                      {pkg.originalPrice && (
                        <Text delete type="secondary" style={{ marginLeft: 8 }}>
                          R$ {pkg.originalPrice.toFixed(2)}
                        </Text>
                      )}
                      {pkg.discount && (
                        <Text type="success" style={{ marginLeft: 8 }}>
                          -{pkg.discount}%
                        </Text>
                      )}
                    </div>
                  </div>

                  <div className={styles.packageCredits}>
                    <Text strong style={{ color: '#1677ff', fontSize: '18px' }}>
                      {pkg.credits.toLocaleString()} créditos
                    </Text>
                    {pkg.bonus && (
                      <Text type="success" style={{ display: 'block', fontSize: '14px' }}>
                        + {pkg.bonus} bônus
                      </Text>
                    )}
                  </div>

                  <div className={styles.packageFeatures}>
                    {pkg.features.map((feature, index) => (
                      <div key={index} className={styles.feature}>
                        <CheckOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        <Text>{feature}</Text>
                      </div>
                    ))}
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>

        {/* Métodos de Pagamento */}
        {selectedPackage && (
          <Card title="Método de Pagamento" className={styles.paymentCard}>
            <Radio.Group 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={styles.paymentMethods}
            >
              {paymentMethods.map((method) => (
                <Radio.Button 
                  key={method.id} 
                  value={method.id}
                  className={styles.paymentMethod}
                >
                  <Space>
                    {method.icon}
                    <div>
                      <div>{method.name}</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {method.description}
                      </Text>
                      {method.discount > 0 && (
                        <Text type="success" style={{ fontSize: '12px', display: 'block' }}>
                          {method.discount}% desconto
                        </Text>
                      )}
                    </div>
                  </Space>
                </Radio.Button>
              ))}
            </Radio.Group>
          </Card>
        )}

        {/* Resumo do Pedido */}
        {selectedPackage && (
          <Card title="Resumo do Pedido" className={styles.summaryCard}>
            <div className={styles.summaryContent}>
              <div className={styles.summaryItem}>
                <Text>Pacote {selectedPkg?.name}</Text>
                <Text strong>R$ {selectedPkg?.price.toFixed(2)}</Text>
              </div>
              
              {paymentMethod === 'pix' && (
                <div className={styles.summaryItem}>
                  <Text type="success">Desconto PIX (5%)</Text>
                  <Text type="success">
                    -R$ {((selectedPkg?.price || 0) * 0.05).toFixed(2)}
                  </Text>
                </div>
              )}
              
              <Divider />
              
              <div className={styles.summaryTotal}>
                <Text strong>Total</Text>
                <Text strong style={{ color: '#1677ff', fontSize: '18px' }}>
                  R$ {getPackagePrice(selectedPkg).toFixed(2)}
                </Text>
              </div>
              
              <div className={styles.summaryCredits}>
                <Text type="secondary">
                  {selectedPkg?.credits.toLocaleString()} créditos
                  {selectedPkg?.bonus && ` + ${selectedPkg.bonus} bônus`}
                </Text>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handlePurchase}
                loading={loading.payment}
                style={{ marginTop: 24 }}
              >
                Finalizar Compra - R$ {getPackagePrice(selectedPkg).toFixed(2)}
              </Button>
            </div>
          </Card>
        )}

        {/* Modal de Pagamento */}
        <Modal
          title={`Pagamento via ${selectedPayment?.name}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          {paymentMethod === 'pix' ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <QrcodeOutlined style={{ fontSize: '64px', color: '#1677ff', marginBottom: 16 }} />
              <Title level={4}>Pagamento via PIX</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                Após confirmar, você receberá o QR Code para pagamento
              </Text>
              
              <div className={styles.modalSummary}>
                <div className={styles.modalSummaryItem}>
                  <Text>Pacote {selectedPkg?.name}</Text>
                  <Text strong>
                    R$ {getPackagePrice(selectedPkg).toFixed(2)}
                  </Text>
                </div>
                <Text type="secondary">
                  {selectedPkg?.credits.toLocaleString()} créditos
                  {selectedPkg?.bonus && ` + ${selectedPkg.bonus} bônus`}
                </Text>
              </div>

              <Button
                type="primary"
                size="large"
                onClick={() => handlePayment()}
                loading={loading.payment}
                style={{ marginTop: 24 }}
              >
                Gerar QR Code PIX
              </Button>
            </div>
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={handlePayment}
              style={{ marginTop: 24 }}
            >
              <Form.Item
                name="cardNumber"
                label="Número do Cartão"
                rules={[
                  { required: true, message: 'Digite o número do cartão' },
                  { pattern: /^\d{16}$/, message: 'Digite um número válido (16 dígitos)' }
                ]}
              >
                <Input 
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="cardName"
                label="Nome no Cartão"
                rules={[{ required: true, message: 'Digite o nome no cartão' }]}
              >
                <Input 
                  placeholder="Nome como está no cartão"
                  size="large"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="expiryMonth"
                    label="Mês"
                    rules={[{ required: true, message: 'Mês' }]}
                  >
                    <Select placeholder="MM" size="large">
                      {Array.from({ length: 12 }, (_, i) => (
                        <Option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="expiryYear"
                    label="Ano"
                    rules={[{ required: true, message: 'Ano' }]}
                  >
                    <Select placeholder="AAAA" size="large">
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <Option key={year} value={String(year)}>
                            {year}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="cvv"
                    label="CVV"
                    rules={[
                      { required: true, message: 'CVV' },
                      { pattern: /^\d{3,4}$/, message: 'CVV inválido' }
                    ]}
                  >
                    <Input 
                      placeholder="123"
                      maxLength={4}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div className={styles.modalSummary}>
                <div className={styles.modalSummaryItem}>
                  <Text>Total a pagar</Text>
                  <Text strong>
                    R$ {getPackagePrice(selectedPkg).toFixed(2)}
                  </Text>
                </div>
              </div>

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
                    loading={loading.payment}
                    size="large"
                  >
                    Confirmar Pagamento
                  </Button>
                </Space>
              </div>
            </Form>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default BuyCreditsPage;

