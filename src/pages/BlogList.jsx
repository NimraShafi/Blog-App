import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../context/Firebase';
import { Card, Button, Modal, Typography, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsRef = collection(db, 'blogs');
      const q = query(blogsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const blogsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBlogs(blogsData);
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
      setBlogs(blogs.filter((blog) => blog.id !== id));
      message.success('Blog deleted successfully!');
    } catch (error) {
      message.error('Failed to delete blog.');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <Title level={2} style={{ textAlign: 'center' }}>
        All Blog Posts
      </Title>

      <Space direction="vertical" style={{ width: '100%' }}>
        {blogs.map((blog) => {
          const isLongContent = blog.content.length > 150;

          return (
            <Card
              key={blog.id}
              title={<span style={{ fontSize: '18px' }}>{blog.title}</span>}
              extra={
                <Space>
                  <Button
                    onClick={() => {
                      setSelectedBlog(blog);
                      setViewModalVisible(true);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => navigate(`/form`, { state: { blog } })}
                  >
                    Edit
                  </Button>
                  <Button danger onClick={() => handleDelete(blog.id)}>
                    Delete
                  </Button>
                </Space>
              }
              style={{
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                margin: '10px',
              }}
            >
              <Text
                style={{
                  fontSize: '16px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {isLongContent
                  ? `${blog.content.substring(0, 150)}...`
                  : blog.content}
              </Text>

              {isLongContent && (
                <Button
                  type="link"
                  onClick={() => {
                    setSelectedBlog(blog);
                    setViewModalVisible(true);
                  }}
                  style={{ padding: 0, marginLeft: 5 }}
                >
                  Read More
                </Button>
              )}
            </Card>
          );
        })}
      </Space>

      <Modal
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width="70vw"
        centered
        Style={{
          height: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'left',
          padding: '20px',
          margin: '40px',
        }}
      >
        <div>
          <Title level={3} style={{ marginBottom: '10px' }}>
            {selectedBlog?.title}
          </Title>
          <Text style={{ fontSize: '18px', lineHeight: '1.6' }}>
            {selectedBlog?.content}
          </Text>
          <br />
          <small style={{ marginTop: '10px', display: 'block' }}>
            Posted on:{' '}
            {selectedBlog &&
              new Date(
                selectedBlog.createdAt?.seconds * 1000
              ).toLocaleDateString()}
          </small>
        </div>
      </Modal>
    </div>
  );
};

export default BlogList;
