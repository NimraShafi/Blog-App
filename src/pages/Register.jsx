import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { useFirebase } from '../context/Firebase';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigate('/');
    }
  }, [firebase.isLoggedIn, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await firebase.signupUserWithEmailAndPassword(
        values.email,
        values.password
      );
      navigate('/login');
    } catch (error) {
      console.error('Registration Error:', error.message);
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
        <Title level={2}>Register</Title>
        <Text type="secondary">Create an account</Text>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input placeholder="Choose a username" />
          </Form.Item>

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
            <Input.Password placeholder="Create a strong password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>

        <Text>
          Already have an account? <Link to="/login">Login</Link>
        </Text>
      </div>
    </div>
  );
};

export default Register;
