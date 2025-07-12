'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, Checkbox, Row, Col, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import styles from './page.module.css';

const { Title, Text } = Typography;

const RegisterPage = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const { register, loading } = useApp();

    const handleRegister = async (values) => {
        // **CORREÇÃO 1: CONSOLE.LOG NO LUGAR CERTO**
        // Este console.log irá mostrar exatamente o que o formulário está enviando.
        // O objeto 'values' deve conter as chaves: name, email, password, confirmPassword e terms.
        console.log("Valores do formulário de registro:", values);

        try {
            await register(values.name, values.email, values.password);
            // Se o registro for bem-sucedido, a mensagem de sucesso já é mostrada pelo AppContext.
            router.push('/dashboard');
        }
        catch (error) {
            // A mensagem de erro já é mostrada pelo AppContext,
            // então não precisamos fazer nada aqui.
        }
    };

    const handleSocialRegister = (provider) => {
        // Esta função é um placeholder para uma futura implementação.
        message.info(`Cadastro com ${provider} ainda não implementado.`);
    };

    return (
      <Layout>
        <div className={styles.container}>
          <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 134px)' }}>
            <Col xs={22} sm={16} md={12} lg={8} xl={6}>
              <Card className={styles.registerCard}>
                <div className={styles.header}>
                  <Title level={2} className={styles.title}>
                    Criar nova conta
                  </Title>
                  <Text type="secondary">
                    Comece sua jornada conosco hoje mesmo.
                  </Text>
                </div>

                <div className={styles.socialButtons}>
                  <Button block icon={<GoogleOutlined />} onClick={() => handleSocialRegister('Google')} className={styles.socialButton}>
                    Continuar com Google
                  </Button>
                  <Button block icon={<GithubOutlined />} onClick={() => handleSocialRegister('GitHub')} className={styles.socialButton}>
                    Continuar com GitHub
                  </Button>
                </div>

                <Divider>ou</Divider>

                <Form form={form} layout="vertical" onFinish={handleRegister} autoComplete="off">
                  <Form.Item name="name" label="Nome completo" rules={[
                    { required: true, message: 'Por favor, insira seu nome completo' },
                    { min: 3, message: 'Nome deve ter pelo menos 3 caracteres' } // Ajustado para 3, como no backend.
                  ]}>
                    <Input prefix={<UserOutlined />} placeholder="Seu nome completo" size="large"/>
                  </Form.Item>

                  <Form.Item name="email" label="E-mail" rules={[
                    { required: true, message: 'Por favor, insira seu e-mail' },
                    { type: 'email', message: 'E-mail inválido' }
                  ]}>
                    <Input prefix={<MailOutlined />} placeholder="seu@email.com" size="large"/>
                  </Form.Item>

                  <Form.Item name="password" label="Senha" rules={[
                    { required: true, message: 'Por favor, insira sua senha' },
                    { min: 6, message: 'A senha deve ter pelo menos 6 caracteres' },
                    // **CORREÇÃO 2: VALIDAÇÃO DO BACKEND ADICIONADA**
                    // Esta regra verifica se a senha atende aos requisitos do backend antes de enviar.
                    { 
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
                      message: 'A senha deve conter uma letra maiúscula, uma minúscula e um número' 
                    }
                  ]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Sua senha" size="large"/>
                  </Form.Item>

                  <Form.Item name="confirmPassword" label="Confirmar senha" dependencies={['password']} hasFeedback rules={[
                    { required: true, message: 'Por favor, confirme sua senha' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('As senhas não coincidem'));
                        },
                    }),
                  ]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirme sua senha" size="large"/>
                  </Form.Item>

                  <Form.Item name="terms" valuePropName="checked" rules={[
                    {
                        validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Você deve aceitar os termos'))
                    }
                  ]}>
                    <Checkbox>
                      Aceito os{' '}
                      <Link href="/terms" target="_blank">
                        <Text type="secondary" underline>Termos de Uso</Text>
                      </Link>
                      {' '}e{' '}
                      <Link href="/privacy" target="_blank">
                        <Text type="secondary" underline>Política de Privacidade</Text>
                      </Link>
                    </Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" block size="large" loading={loading.auth}>
                      Criar conta
                    </Button>
                  </Form.Item>
                </Form>

                <div className={styles.footer}>
                  <Text type="secondary">
                    Já tem uma conta?{' '}
                    <Link href="/login">
                      <Text type="secondary" underline>
                        Entrar
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

export default RegisterPage;