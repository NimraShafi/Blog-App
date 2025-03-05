import React, { useEffect, useState } from 'react';
import { Button, Menu, Drawer } from 'antd';
import { MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/Firebase';
import blog from '../assets/blog.png';

const Navbar = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(firebase.isLoggedIn);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    setIsAuthenticated(firebase.isLoggedIn);
  }, [firebase.isLoggedIn]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreatePost = () => {
    if (isAuthenticated) {
      navigate('/form');
    } else {
      alert('Please login first to create a post.');
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await firebase.logoutUser();
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  return (
    <>
      {!isMobile ? (
        <Menu
          mode="horizontal"
          style={{
            width: '100%',
            height: '60px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            fontSize: '16px',
            padding: '0 30px',
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '22px',
              color: '#333',
            }}
          >
            <img
              src={blog}
              alt="Blog Logo"
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            />
            <span style={{ fontWeight: 'bold', fontSize: '22px' }}>
              BlogApp
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Menu.Item key="blog">
              <Link to="/" style={{ fontSize: '16px' }}>
                Blogs
              </Link>
            </Menu.Item>

            {!isAuthenticated ? (
              <>
                <Menu.Item key="login">
                  <Link to="/login" style={{ fontSize: '16px' }}>
                    Login
                  </Link>
                </Menu.Item>
                <Menu.Item key="register">
                  <Link to="/register" style={{ fontSize: '16px' }}>
                    Signup
                  </Link>
                </Menu.Item>
              </>
            ) : (
              <Menu.Item key="logout">
                <Button
                  onClick={handleLogout}
                  type="text"
                  style={{ fontSize: '16px' }}
                >
                  Logout
                </Button>
              </Menu.Item>
            )}

            <Menu.Item key="createPost">
              <Button
                type="primary"
                onClick={handleCreatePost}
                style={{ fontSize: '16px' }}
              >
                Create Post
              </Button>
            </Menu.Item>
          </div>
        </Menu>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            fontSize: '16px',
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '22px',
              color: '#333',
            }}
          >
            <img
              src={blog}
              alt="Blog Logo"
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            />
            <span style={{ fontWeight: 'bold', fontSize: '22px' }}>
              BlogApp
            </span>
          </Link>

          <Button
            type="text"
            onClick={() => setDrawerVisible(true)}
            icon={<MenuOutlined />}
            style={{ fontSize: '16px' }}
          />
        </div>
      )}

      <Drawer
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        style={{ fontSize: '16px' }}
      >
        <Menu mode="vertical" selectable={false} style={{ fontSize: '16px' }}>
          <Menu.Item key="home" onClick={() => setDrawerVisible(false)}>
            <Link to="/" style={{ fontSize: '16px' }}>
              Home
            </Link>
          </Menu.Item>

          {!isAuthenticated ? (
            <>
              <Menu.Item key="login" onClick={() => setDrawerVisible(false)}>
                <Link to="/login" style={{ fontSize: '16px' }}>
                  Login
                </Link>
              </Menu.Item>
              <Menu.Item key="register" onClick={() => setDrawerVisible(false)}>
                <Link to="/register" style={{ fontSize: '16px' }}>
                  Signup
                </Link>
              </Menu.Item>
            </>
          ) : (
            <Menu.Item
              key="logout"
              onClick={handleLogout}
              style={{ fontSize: '16px' }}
            >
              Logout
            </Menu.Item>
          )}

          <Menu.Item key="createPost">
            <Button
              type="primary"
              onClick={handleCreatePost}
              style={{ fontSize: '16px' }}
            >
              Create Post
            </Button>
          </Menu.Item>
        </Menu>
      </Drawer>
    </>
  );
};

export default Navbar;
