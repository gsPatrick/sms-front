'use client';

import React from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Divider, 
  Checkbox,
  Space,
  Row,
  Col,
  message
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  GoogleOutlined, 
  GithubOutlined 
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import styles from './page.module.css';

const { Title, Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { login, loading } = useApp();

  const handleLogin = async (values: LoginFormData) => {
    try {
      await login(values.email, values.password);
      router.push('/dashboard');
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  const handleSocialLogin = (provider: string) => {
    message.info(`Login com ${provider} em desenvolvimento`);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 134px)' }}>
          <Col xs={22} sm={16} md={12} lg={8} xl={6}>
            <Card className={styles.loginCard}>
              <div className={styles.header}>
                <Title level={2} className={styles.title}>
                  Entrar na sua conta
                </Title>
                <Text type="secondary">
                  Bem-vindo de volta! Entre com suas credenciais.
                </Text>
              </div>

              <div className={styles.socialButtons}>
                <Button 
                  block 
                  icon={<GoogleOutlined />}
                  onClick={() => handleSocialLogin('Google')}
                  className={styles.socialButton}
                >
                  Continuar com Google
                </Button>
                <Button 
                  block 
                  icon={<GithubOutlined />}
                  onClick={() => handleSocialLogin('GitHub')}
                  className={styles.socialButton}
                >
                  Continuar com GitHub
                </Button>
              </div>

              <Divider>ou</Divider>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleLogin}
                autoComplete="off"
              >
                <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    { required: true, message: 'Por favor, insira seu e-mail' },
                    { type: 'email', message: 'E-mail inválido' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />}
                    placeholder="seu@email.com"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Senha"
                  rules={[
                    { required: true, message: 'Por favor, insira sua senha' },
                    { min: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />}
                    placeholder="Sua senha"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <div className={styles.formOptions}>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>Lembrar de mim</Checkbox>
                    </Form.Item>
                    <Link href="/forgot-password">
                      <Text type="secondary">Esqueceu a senha?</Text>
                    </Link>
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    size="large"
                    loading={loading.auth}
                  >
                    Entrar
                  </Button>
                </Form.Item>
              </Form>

              <div className={styles.footer}>
                <Text type="secondary">
                  Não tem uma conta?{' '}
                  <Link href="/register">
                    <Text type="secondary" underline>
                      Cadastre-se
                    </Text>
                  </Link>
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default LoginPage;

