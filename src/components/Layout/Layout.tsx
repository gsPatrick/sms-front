'use client';

import React from 'react';
import { Layout as AntLayout, Menu, Button, Typography, Space, Dropdown } from 'antd';
import { 
  HomeOutlined, 
  DashboardOutlined, 
  CreditCardOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import styles from './Layout.module.css';

const { Header, Content, Footer } = AntLayout;
const { Text } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useApp();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">Início</Link>,
    },
    ...(isAuthenticated ? [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: <Link href="/dashboard">Dashboard</Link>,
      },
      {
        key: '/buy-credits',
        icon: <CreditCardOutlined />,
        label: <Link href="/buy-credits">Comprar Créditos</Link>,
      },
    ] : []),
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Meu Perfil',
      icon: <UserOutlined />,
    },
    {
      key: 'divider',
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Sair',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const authMenuItems = isAuthenticated ? [
    {
      key: 'user',
      label: (
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
          <Space style={{ cursor: 'pointer' }}>
            <UserOutlined />
            <div style={{ textAlign: 'left' }}>
              <div>
                <Text strong>{user?.name}</Text>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {user?.credits} créditos
                </Text>
              </div>
            </div>
            <DownOutlined style={{ fontSize: '10px' }} />
          </Space>
        </Dropdown>
      ),
    },
  ] : [
    {
      key: '/login',
      icon: <LoginOutlined />,
      label: <Link href="/login">Entrar</Link>,
    },
    {
      key: '/register',
      icon: <UserOutlined />,
      label: <Link href="/register">Cadastrar</Link>,
    },
  ];

  return (
    <AntLayout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Link href="/">
              <Text strong style={{ fontSize: '20px', color: '#1677ff' }}>
                SMS BRA
              </Text>
            </Link>
          </div>
          
          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            items={menuItems}
            className={styles.mainMenu}
          />
          
          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            items={authMenuItems}
            className={styles.authMenu}
          />
        </div>
      </Header>

      <Content className={styles.content}>
        {children}
      </Content>

      <Footer className={styles.footer}>
        <div className={styles.footerContent}>
          <Text type="secondary">
            © 2024 SMS BRA. Todos os direitos reservados.
          </Text>
          <Space split={<Text type="secondary">|</Text>}>
            <Link href="/terms">
              <Text type="secondary">Termos de Uso</Text>
            </Link>
            <Link href="/privacy">
              <Text type="secondary">Privacidade</Text>
            </Link>
            <Link href="/support">
              <Text type="secondary">Suporte</Text>
            </Link>
          </Space>
        </div>
      </Footer>
    </AntLayout>
  );
};

export default AppLayout;

