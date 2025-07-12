'use client';

import React from 'react';
import { Menu, Typography, Space, Dropdown } from 'antd';
import { UserOutlined, LoginOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '../../contexts/AppContext';

const { Text } = Typography;

const DynamicHeaderMenu = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useApp();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const userMenuItems = [
        {
            key: 'profile',
            label: 'Meu Perfil',
            icon: <UserOutlined />,
            onClick: () => router.push('/dashboard'),
        },
        {
            key: 'divider',
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Sair',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    if (isAuthenticated && user) {
        return (
            <Menu
                mode="horizontal"
                selectable={false}
                style={{ flexShrink: 0, borderBottom: 'none', background: 'transparent' }}
                items={[
                    {
                        key: 'user',
                        label: (
                            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                                <Space style={{ cursor: 'pointer' }}>
                                    <UserOutlined />
                                    <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                                        <Text strong>{user.username}</Text>
                                        <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                                            {user.credits} créditos
                                        </Text>
                                    </div>
                                    <DownOutlined style={{ fontSize: '10px' }} />
                                </Space>
                            </Dropdown>
                        ),
                    },
                ]}
            />
        );
    }

    return (
        <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            style={{ flexShrink: 0, borderBottom: 'none', background: 'transparent' }}
            items={[
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
            ]}
        />
    );
};

export default DynamicHeaderMenu;