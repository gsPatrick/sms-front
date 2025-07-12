import { Inter } from 'next/font/google';
import './globals.css';
import styles from './Layout.module.css';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { ConfigProvider, Layout as AntLayout, Menu, Typography, Space } from 'antd';
import { HomeOutlined, DashboardOutlined, CreditCardOutlined } from '@ant-design/icons';
import Link from 'next/link';
import ptBR from 'antd/locale/pt_BR';
import { AppProvider } from '@/contexts/AppContext';
import DynamicHeaderMenu from '@/components/DynamicHeaderMenu/DynamicHeaderMenu';

const { Header, Content, Footer } = AntLayout;
const { Text } = Typography;

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'SMS BRA - Recebimento de SMS API',
    description: 'Plataforma moderna para recebimento de códigos SMS via API',
};

const theme = {
    token: { colorPrimary: '#1677ff', borderRadius: 6 },
    components: {
        Layout: { headerBg: '#ffffff', headerHeight: 64, headerPadding: '0 24px' },
        Menu: { itemBg: 'transparent', itemSelectedBg: '#e6f4ff', itemHoverBg: '#f5f5f5' },
    },
};

export default function RootLayout({ children }) {
    const staticMenuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: <Link href="/">Início</Link>,
        },
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
    ];

    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <StyledComponentsRegistry>
                    <ConfigProvider theme={theme} locale={ptBR}>
                        <AppProvider>
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
                                            items={staticMenuItems}
                                            className={styles.mainMenu}
                                            selectable={false}
                                        />
                                        
                                        <DynamicHeaderMenu />
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
                                        {/* REMOVIDO: Links para páginas inexistentes foram removidos daqui */}
                                    </div>
                                </Footer>
                            </AntLayout>
                        </AppProvider>
                    </ConfigProvider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}