import { Inter } from 'next/font/google';
import './globals.css';
import styles from './Layout.module.css'; // Mova o CSS para cá ou ajuste o caminho
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { ConfigProvider, Layout as AntLayout, Menu, Typography, Space } from 'antd';
import { HomeOutlined, DashboardOutlined, CreditCardOutlined } from '@ant-design/icons';
import Link from 'next/link';
import ptBR from 'antd/locale/pt_BR';
import { AppProvider } from '@/contexts/AppContext';
import DynamicHeaderMenu from '../components/DynamicHeaderMenu/DynamicHeaderMenu'; // Importe o novo componente

const { Header, Content, Footer } = AntLayout;
const { Text } = Typography;

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'SMS BRA - Recebimento de SMS API',
    description: 'Plataforma moderna para recebimento de códigos SMS via API',
};

// Tema Ant Design
const theme = {
    token: { colorPrimary: '#1677ff', borderRadius: 6 },
    components: {
        Layout: { headerBg: '#ffffff', headerHeight: 64, headerPadding: '0 24px' },
        Menu: { itemBg: 'transparent', itemSelectedBg: '#e6f4ff', itemHoverBg: '#f5f5f5' },
    },
};

// **NOTA**: Este agora é o seu layout principal e é um Server Component por padrão.
export default function RootLayout({ children }) {
    // Itens de menu que não dependem do estado de autenticação podem ficar aqui.
    // Os itens que dependem foram movidos para DynamicHeaderMenu.
    const staticMenuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: <Link href="/">Início</Link>,
        },
        // Itens de Dashboard/Comprar Créditos serão gerenciados de forma diferente
        // ou exibidos condicionalmente no componente cliente se necessário.
        // Para simplicidade, vamos mantê-los aqui e o Next.js lidará com a navegação.
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
                        <AppProvider> {/* O provider envolve tudo, isso está correto */}
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
                                        
                                        {/* Usamos o Menu aqui, mas sem os itens dinâmicos */}
                                        <Menu
                                            mode="horizontal"
                                            items={staticMenuItems}
                                            className={styles.mainMenu}
                                            // A seleção da chave ativa precisaria de um componente cliente.
                                            // Por enquanto, vamos remover a seleção automática para evitar complexidade.
                                            selectable={false}
                                        />
                                        
                                        {/* AQUI ESTÁ A MÁGICA: Renderizamos o componente cliente dinâmico */}
                                        <DynamicHeaderMenu />
                                    </div>
                                </Header>

                                <Content className={styles.content}>
                                    {children} {/* As páginas serão renderizadas aqui */}
                                </Content>

                                <Footer className={styles.footer}>
                                    <div className={styles.footerContent}>
                                        <Text type="secondary">
                                            © 2024 SMS BRA. Todos os direitos reservados.
                                        </Text>
                                        <Space split={<Text type="secondary">|</Text>}>
                                            <Link href="/terms"><Text type="secondary">Termos de Uso</Text></Link>
                                            <Link href="/privacy"><Text type="secondary">Privacidade</Text></Link>
                                            <Link href="/support"><Text type="secondary">Suporte</Text></Link>
                                        </Space>
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