'use client';

import React from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Space,
  Divider 
} from 'antd';
import { 
  ThunderboltOutlined,
  SafetyOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from './page.module.css';

const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <ThunderboltOutlined />,
      title: 'Instantâneo',
      description: 'Receba códigos SMS em segundos com nossa API de alta performance.'
    },
    {
      icon: <SafetyOutlined />,
      title: 'Seguro',
      description: 'Máxima segurança com criptografia e proteção de dados.'
    },
    {
      icon: <GlobalOutlined />,
      title: 'Global',
      description: 'Números virtuais de mais de 100 países disponíveis.'
    },
    {
      icon: <ClockCircleOutlined />,
      title: '24/7',
      description: 'Suporte especializado disponível a qualquer momento.'
    }
  ];

  const stats = [
    { title: 'Usuários Ativos', value: '50K+' },
    { title: 'SMS Processados', value: '1M+' },
    { title: 'Uptime', value: '99.9%' },
    { title: 'Países', value: '100+' }
  ];

  return (
    <Layout>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <Row justify="center" align="middle" style={{ minHeight: '500px' }}>
              <Col xs={24} md={16} lg={12} className="text-center">
                <Title level={1} className={styles.heroTitle}>
                  Receba códigos SMS instantaneamente
                </Title>
                <Paragraph className={styles.heroDescription}>
                  A plataforma mais moderna e confiável para recebimento de códigos SMS via API. 
                  Integração simples, números globais e máxima segurança.
                </Paragraph>
                <Space size="large" className={styles.heroActions}>
                  <Link href="/register">
                    <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                      Começar Agora
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="large" icon={<PlayCircleOutlined />}>
                      Ver Demo
                    </Button>
                  </Link>
                </Space>
              </Col>
            </Row>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.stats}>
          <div className="container">
            <Row gutter={[32, 32]} justify="center">
              {stats.map((stat, index) => (
                <Col xs={12} sm={6} key={index}>
                  <Card className={styles.statCard}>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      valueStyle={{ color: '#1677ff', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding">
          <div className="container">
            <Row justify="center" style={{ marginBottom: '48px' }}>
              <Col xs={24} md={16} lg={12} className="text-center">
                <Title level={2}>Por que escolher a SMS BRA?</Title>
                <Paragraph className="text-muted">
                  Oferecemos a plataforma mais avançada e confiável para recebimento de códigos SMS,
                  com recursos que atendem desde startups até grandes corporações.
                </Paragraph>
              </Col>
            </Row>
            
            <Row gutter={[32, 32]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card className={styles.featureCard}>
                    <div className={styles.featureIcon}>
                      {feature.icon}
                    </div>
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph className="text-muted">
                      {feature.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* How it Works Section */}
        <section className={styles.howItWorks}>
          <div className="container">
            <Row justify="center" style={{ marginBottom: '48px' }}>
              <Col xs={24} md={16} lg={12} className="text-center">
                <Title level={2}>Como funciona</Title>
                <Paragraph className="text-muted">
                  Em apenas 4 passos simples, você estará recebendo códigos SMS 
                  com a máxima confiabilidade.
                </Paragraph>
              </Col>
            </Row>
            
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} sm={12} lg={6}>
                <Card className={styles.stepCard}>
                  <div className={styles.stepNumber}>1</div>
                  <Title level={4}>Cadastre-se</Title>
                  <Paragraph className="text-muted">
                    Crie sua conta gratuita em menos de 2 minutos
                  </Paragraph>
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card className={styles.stepCard}>
                  <div className={styles.stepNumber}>2</div>
                  <Title level={4}>Configure a API</Title>
                  <Paragraph className="text-muted">
                    Integre nossa API com apenas algumas linhas de código
                  </Paragraph>
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card className={styles.stepCard}>
                  <div className={styles.stepNumber}>3</div>
                  <Title level={4}>Compre Créditos</Title>
                  <Paragraph className="text-muted">
                    Adicione créditos e comece a receber SMS imediatamente
                  </Paragraph>
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card className={styles.stepCard}>
                  <div className={styles.stepNumber}>4</div>
                  <Title level={4}>Monitore</Title>
                  <Paragraph className="text-muted">
                    Acompanhe todas as métricas em tempo real
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className="container">
            <Row justify="center">
              <Col xs={24} md={16} lg={12} className="text-center">
                <Title level={2}>Pronto para começar?</Title>
                <Paragraph className={styles.ctaDescription}>
                  Junte-se a milhares de desenvolvedores que já escolheram a SMS BRA. 
                  Comece gratuitamente e veja a diferença.
                </Paragraph>
                <Space size="large">
                  <Link href="/register">
                    <Button type="primary" size="large">
                      Começar Gratuitamente
                    </Button>
                  </Link>
                  <Link href="/docs">
                    <Button size="large">
                      Ver Documentação
                    </Button>
                  </Link>
                </Space>
              </Col>
            </Row>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;

