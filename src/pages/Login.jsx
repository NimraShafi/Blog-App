import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Typography, Alert } from 'antd';
import { useFirebase } from '../context/Firebase';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigate('/');
    }
  }, [firebase.isLoggedIn, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      await firebase.signinWithEmailAndPassword(values.email, values.password);
      navigate('/');
    } catch (err) {
      console.error('Login Error:', err.message);

      if (err.message.includes('user-not-found')) {
        setError('No account found. Please create an account.');
      } else if (err.message.includes('wrong-password')) {
        setError('Incorrect password. Try again.');
      } else {
        setError('Failed to login. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: '100%',
          padding: '70px 30px',
          textAlign: 'center',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          background: '#fff',
        }}
      >
        <Title level={2}>Login</Title>
        <Text type="secondary">Sign in to continue</Text>

        {error && (
          <Alert
            message={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {error}
              </span>
            }
            type="error"
            showIcon
            style={{
              marginBottom: 20,
              marginTop: 20,
              padding: '10px 16px',
              textAlign: 'left',
            }}
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <Text>
          Don't have an account? <Link to="/register">Register</Link>
        </Text>
      </div>
    </div>
  );
};

export default Login;
