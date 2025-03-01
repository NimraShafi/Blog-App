import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { db } from '../context/Firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

const { Title } = Typography;

const BlogForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const blogToEdit = location.state?.blog || null;

  useEffect(() => {
    if (blogToEdit) {
      form.setFieldsValue({
        title: blogToEdit.title,
        content: blogToEdit.content,
      });
    }
  }, [blogToEdit, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (blogToEdit) {
        await updateDoc(doc(db, 'blogs', blogToEdit.id), {
          title: values.title,
          content: values.content,
        });
        message.success('Blog updated successfully!');
      } else {
        const newDocRef = doc(db, 'blogs', new Date().getTime().toString());
        await setDoc(newDocRef, {
          title: values.title,
          content: values.content,
          createdAt: new Date(),
        });
        message.success('Blog posted successfully!');
      }
      navigate('/');
    } catch (error) {
      message.error('Error saving blog.');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 500,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: '30px 10px',
        }}
      >
        <Title level={2} style={{ textAlign: 'center' }}>
          {blogToEdit ? 'Edit Blog Post' : 'Create Blog Post'}
        </Title>

        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label={<span style={{ fontSize: '16px' }}>Title</span>}
            name="title"
            rules={[{ required: true, message: 'Enter title' }]}
          >
            <Input
              placeholder="Enter blog title"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: '16px' }}>Content</span>}
            name="content"
            rules={[{ required: true, message: 'Enter content' }]}
          >
            <Input.TextArea
              rows={5}
              placeholder="Write your blog content here..."
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ fontSize: '16px' }}
            >
              {loading ? 'Saving...' : blogToEdit ? 'Update Blog' : 'Post Blog'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BlogForm;
