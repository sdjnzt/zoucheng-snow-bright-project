import React, { useState, useEffect, useCallback } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  message, 
  Space,
  Row,
  Col,
  Flex
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  SafetyCertificateOutlined,
  SecurityScanOutlined,
  VideoCameraOutlined,
  SafetyOutlined,
  GlobalOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/login.css';

const { Title, Text, Paragraph } = Typography;

// 生成随机验证码
const generateCaptcha = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let captcha = '';
  for (let i = 0; i < 4; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

// 绘制验证码
const drawCaptcha = (captcha: string, canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 设置背景
  ctx.fillStyle = '#f0f2f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制文字
  ctx.fillStyle = '#333';
  ctx.font = 'bold 24px Arial';
  ctx.textBaseline = 'middle';
  
  // 随机旋转和位置
  for (let i = 0; i < captcha.length; i++) {
    const x = 20 + i * 20;
    const y = canvas.height / 2 + Math.random() * 8 - 4;
    const rotate = Math.random() * 0.4 - 0.2;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotate);
    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 40%)`;
    ctx.fillText(captcha[i], 0, 0);
    ctx.restore();
  }

  // 添加干扰线
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  // 添加干扰点
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
    ctx.fill();
  }
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [form] = Form.useForm();

  // 检查是否已登录
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  // 刷新验证码
  const refreshCaptcha = useCallback(() => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
    const canvas = document.getElementById('captchaCanvas') as HTMLCanvasElement;
    if (canvas) {
      drawCaptcha(newCaptcha, canvas);
    }
  }, []);

  // 初始化验证码
  useEffect(() => {
    const canvas = document.getElementById('captchaCanvas') as HTMLCanvasElement;
    if (canvas) {
      drawCaptcha(captcha, canvas);
    }
  }, [captcha]);

  const onFinish = async (values: any) => {
    // 验证码检查
    if (values.captcha.toLowerCase() !== captcha.toLowerCase()) {
      message.error('验证码错误！');
      refreshCaptcha();
      form.setFieldValue('captcha', '');
      return;
    }

    setLoading(true);
    try {
      // 这里应该调用实际的登录 API
      // 模拟 API 调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功
      if (values.username === 'admin' && values.password === 'admin123456') {
        // 存储登录状态
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({
          username: values.username,
          role: 'admin',
          name: '管理员'
        }));
        
        message.success('登录成功！');
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        message.error('用户名或密码错误！');
        refreshCaptcha();
      }
    } catch (error) {
      message.error('登录失败，请重试！');
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // 系统特点数据
  const features = [
    {
      icon: <VideoCameraOutlined />,
      title: '智能监控',
      description: '高清视频监控，全方位覆盖'
    },
    {
      icon: <SafetyOutlined />,
      title: '安全防护',
      description: '智能预警，及时响应'
    },
    {
      icon: <GlobalOutlined />,
      title: '数据分析',
      description: '大数据分析，科学决策'
    },
    {
      icon: <TeamOutlined />,
      title: '协同管理',
      description: '多部门联动，高效协作'
    }
  ];

  return (
    <Row className="login-container">
      {/* 左侧信息区 */}
      <Col xs={0} sm={0} md={12} lg={12} xl={12} className="login-banner">
        <div className="banner-content">
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <div className="banner-header">
              <SecurityScanOutlined className="banner-logo" />
              <Title level={2} style={{ color: '#fff', margin: '24px 0' }}>
                雪亮工程平台
              </Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                邹城市人民政府办公室智能化管理平台
              </Paragraph>
            </div>

            <div className="banner-features">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <div className="feature-text">
                    <Text strong style={{ color: '#fff', fontSize: '16px' }}>
                      {feature.title}
                    </Text>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {feature.description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Space>

          <div className="banner-footer">
            <Text style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              © 2024 邹城市人民政府办公室. All Rights Reserved.
            </Text>
          </div>
        </div>
      </Col>

      {/* 右侧登录区 */}
      <Col xs={24} sm={24} md={12} lg={12} xl={12} className="login-content">
        <div className="login-form-container">
          <div className="login-form-header">
            <Title level={3}>
              欢迎登录
            </Title>
            <Paragraph type="secondary">
              请输入您的账号和密码
            </Paragraph>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名！' },
                { min: 3, message: '用户名至少3个字符！' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="form-icon" />}
                placeholder="用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码！' },
                { min: 6, message: '密码至少6个字符！' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="form-icon" />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item
              name="captcha"
              rules={[
                { required: true, message: '请输入验证码！' },
                { len: 4, message: '验证码必须是4个字符！' }
              ]}
            >
              <Row gutter={8}>
                <Col flex="auto">
                  <Input
                    prefix={<SafetyCertificateOutlined className="form-icon" />}
                    placeholder="验证码"
                    maxLength={4}
                  />
                </Col>
                <Col flex="none">
                  <div 
                    className="captcha-container" 
                    onClick={refreshCaptcha}
                    title="点击刷新验证码"
                  >
                    <canvas 
                      id="captchaCanvas" 
                      width="120" 
                      height="40" 
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading}
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Login; 