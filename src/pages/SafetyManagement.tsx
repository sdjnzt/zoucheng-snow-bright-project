import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tag, Button, Modal, Form, Input, Select, Space, Alert, Timeline, Statistic, Badge, Progress, Switch, message, Divider } from 'antd';
import { 
  SafetyOutlined, 
  FireOutlined, 
  ExperimentOutlined,
  UserDeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BellOutlined,
  CarOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  PhoneOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

// 雪亮工程安全事件数据
const safetyEvents = [
  { id: '1', type: 'intrusion', location: '邹城市政府广场', severity: 'high', status: 'active', timestamp: '2025-07-15T14:15:00', description: '检测到可疑人员进入政府广场禁区,    cameraId: dev001', faceDetected: true, vehicleDetected: false, responseTime: '2', assignedTeam: '巡逻队01' },
  { id: '2', type: 'traffic', location: '邹城市中心十字路口', severity: 'medium', status: 'investigating', timestamp: '2025-07-15T14:16:00', description: '交通拥堵，需要交警疏导,    cameraId: dev003', faceDetected: false, vehicleDetected: true, responseTime: '5', assignedTeam: '交警队01' },
  { id: '3', type: 'emergency', location: '邹城市人民医院', severity: 'critical', status: 'active', timestamp: '2025-07-15T14:18:00', description: '医院门口发生交通事故，需要紧急救援,    cameraId: dev010', faceDetected: true, vehicleDetected: true, responseTime: '1', assignedTeam: '消防队01' },
  { id: '4', type: 'fire', location: '邹城市商业步行街', severity: 'high', status: 'resolved', timestamp: '2025-07-15T14:21:00', description: '商业街发现火情，已及时扑灭,    cameraId: dev004', faceDetected: true, vehicleDetected: false, responseTime: '3', assignedTeam: '消防队02' },
  { id: '5', type: 'intrusion', location: '邹城市建设银行', severity: 'critical', status: 'active', timestamp: '2025-07-15T14:22:00', description: '银行门口发现可疑人员徘徊,    cameraId: dev006', faceDetected: true, vehicleDetected: false, responseTime: '1', assignedTeam: '巡逻队02' }
];

const SafetyManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [form] = Form.useForm();
  const [autoAlert, setAutoAlert] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // 模拟实时数据更新
  useEffect(() => {
    if (autoAlert) {
      const interval = setInterval(() => {
        // 模拟新事件生成（静默处理，不显示提示）
        if (Math.random() > 0.95) {
          // 静默处理新事件，不显示提示
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [autoAlert]);

  const handleProcessEvent = (event: any) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      console.log('处理安全事件:', form.getFieldsValue());
      message.success('安全事件处理成功');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleEmergencyMode = (checked: boolean) => {
    setEmergencyMode(checked);
    if (checked) {
      message.warning('紧急模式已激活，所有安全事件将优先处理');
    } else {
      message.info('紧急模式已关闭');
    }
  };

  // 安全事件列定义
  const columns = [
    {
      title: '事件类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeConfig = {
          fire: { color: 'red', text: '火灾', icon: <FireOutlined /> },
          gas: { color: 'orange', text: '气体泄漏', icon: <ExperimentOutlined /> },
          intrusion: { color: 'purple', text: '入侵检测', icon: <UserDeleteOutlined /> },
          emergency: { color: 'volcano', text: '紧急情况', icon: <ExclamationCircleOutlined /> },
          traffic: { color: 'blue', text: '交通事件', icon: <CarOutlined /> },
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return (
          <Space>
            {config.icon}
            <Tag color={config.color}>{config.text}</Tag>
          </Space>
        );
      },
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => {
        const severityConfig = {
          low: { color: 'green', text: '低' },
          medium: { color: 'orange', text: '中' },
          high: { color: 'red', text: '高' },
          critical: { color: 'purple', text: '严重' },
        };
        const config = severityConfig[severity as keyof typeof severityConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'red', text: '活跃', icon: <ExclamationCircleOutlined /> },
          investigating: { color: 'orange', text: '调查中', icon: <ClockCircleOutlined /> },
          resolved: { color: 'green', text: '已解决', icon: <CheckCircleOutlined /> },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Space>
            {config.icon}
            <Tag color={config.color}>{config.text}</Tag>
          </Space>
        );
      },
    },
    {
      title: '检测信息',
      key: 'detection',
      width: 120,
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small">
          {record.faceDetected && <Badge status="processing" text="脸检测" />}
          {record.vehicleDetected && <Badge status="processing" text="车辆检测" />}
        </Space>
      ),
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      width: 100,
    },
    {
      title: '处理团队',
      dataIndex: 'assignedTeam',
      key: 'assignedTeam',
      width: 120,
    },
    {
      title: '发生时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          size="small"
          onClick={() => handleProcessEvent(record)}
          disabled={record.status === 'resolved'}
        >
          {record.status === 'resolved' ? '已处理' : '处理'}
        </Button>
      ),
    },
  ];

  // 统计活跃事件
  const activeEvents = safetyEvents.filter(e => e.status === 'active');
  const investigatingEvents = safetyEvents.filter(e => e.status === 'investigating');
  const resolvedEvents = safetyEvents.filter(e => e.status === 'resolved');

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>雪亮工程安全管理中心</h2>
        <Space>
          <Switch
            checked={autoAlert}
            onChange={setAutoAlert}
            checkedChildren="自动报警"
            unCheckedChildren="手动报警"
          />
          <Switch
            checked={emergencyMode}
            onChange={handleEmergencyMode}
            checkedChildren="紧急模式"
            unCheckedChildren="正常模式"
          />
        </Space>
      </div>
      
      {/* 紧急模式告警 */}
      {emergencyMode && (
        <Alert
          message="紧急模式已激活"
          description="所有安全事件将优先处理，应急响应团队已待命"
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button 
              size="small" 
              danger
              onClick={() => setEmergencyMode(false)}
            >
              退出紧急模式
            </Button>
          }
        />
      )}

      {/* 告警横幅 */}
      {activeEvents.length > 0 && (
        <Alert
          message={`当前有 ${activeEvents.length} 个活跃安全事件需要处理`}
          description="请及时处理相关安全事件，确保城市安全"
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="primary">
              立即处理
            </Button>
          }
        />
      )}

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="活跃事件"
              value={activeEvents.length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="调查中"
              value={investigatingEvents.length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="已解决"
              value={resolvedEvents.length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="总事件数"
              value={safetyEvents.length}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 性能指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="平均响应时间"
              value={2.5}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="分钟"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="事件处理率"
              value={85.6}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="在线监控设备"
              value={23}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="应急团队"
              value={8}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="支"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 安全事件列表 */}
        <Col span={16}>
          <Card title="安全事件列表" size="small">
            <Table
              dataSource={safetyEvents}
              columns={columns}
              pagination={{ pageSize: 8 }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>

        {/* 实时监控面板 */}
        <Col span={8}>
          <Card title="实时监控" size="small">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>系统状态</span>
                <Badge status="success" text="正常" />
              </div>
              <Progress percent={95} size="small" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>监控覆盖率</span>
                <span>98.5%</span>
              </div>
              <Progress percent={98.5} size="small" strokeColor="#52c41a" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>报警准确率</span>
                <span>92.3%</span>
              </div>
              <Progress percent={92.3} size="small" strokeColor="#1890ff" />
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button size="small" icon={<PhoneOutlined />} block>
                    报警电话: 110
                  </Button>
                  <Button size="small" icon={<PhoneOutlined />} block>
                    消防电话: 119
                  </Button>
                  <Button size="small" icon={<PhoneOutlined />} block>
                    急救电话: 120
                  </Button>
                </Space>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 处理事件模态框 */}
      <Modal
        title={
          <Space>
            <SafetyOutlined />
            处理安全事件
          </Space>
        }
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        {selectedEvent && (
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="事件类型">
                  <Input value={selectedEvent.type} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="发生位置">
                  <Input value={selectedEvent.location} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="严重程度">
                  <Input value={selectedEvent.severity} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="发生时间">
                  <Input value={selectedEvent.timestamp} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="事件描述">
              <TextArea value={selectedEvent.description} disabled rows={3} />
            </Form.Item>
            <Form.Item label="处理方案" name="solution" rules={[{ required: true, message: '请输入处理方案' }]}>
              <TextArea rows={4} placeholder="请详细描述处理方案..." />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="处理团队" name="team" rules={[{ required: true, message: '请选择处理团队' }]}>
                  <Select placeholder="选择处理团队">
                    <Option value="巡逻队01">巡逻队01</Option>
                    <Option value="巡逻队02">巡逻队02</Option>
                    <Option value="交警队01">交警队01</Option>
                    <Option value="消防队01">消防队01</Option>
                    <Option value="消防队02">消防队02</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="优先级" name="priority" rules={[{ required: true, message: '请选择优先级' }]}>
                  <Select placeholder="选择优先级">
                    <Option value="low">低</Option>
                    <Option value="medium">中</Option>
                    <Option value="high">高</Option>
                    <Option value="critical">紧急</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default SafetyManagement; 