import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  Badge,
  Typography,
  Divider,
  Tooltip,
  Avatar,
  List,
  Drawer,
  Switch,
  Radio,
  Tabs,
  Progress,
  notification,
  Flex,
  Dropdown,
  MenuProps,
  Image,
  Descriptions,
  Timeline,
  Alert
} from 'antd';
import {
  SecurityScanOutlined,
  EyeOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TeamOutlined,
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  FilterOutlined,
  ExportOutlined,
  FullscreenOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  AudioMutedOutlined,
  CameraOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { Line, Pie, Column, Scatter } from '@ant-design/plots';
import { getDefaultMonitorVideo } from '../utils/videoUtils';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface ControlPoint {
  id: string;
  name: string;
  type: 'school' | 'square' | 'commercial' | 'transport' | 'residential' | 'other';
  location: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  cameraCount: number;
  onlineCameras: number;
  alertCount: number;
  lastAlert: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  coordinates: [number, number];
  coverage: number;
  imageUrl?: string;
}

interface ControlStatistics {
  totalPoints: number;
  activePoints: number;
  totalCameras: number;
  onlineCameras: number;
  todayAlerts: number;
  byType: { type: string; count: number }[];
  byStatus: { status: string; count: number }[];
  byPriority: { priority: string; count: number }[];
}

const KeyControl: React.FC = () => {
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);
  const [statistics, setStatistics] = useState<ControlStatistics>({
    totalPoints: 0,
    activePoints: 0,
    totalCameras: 0,
    onlineCameras: 0,
    todayAlerts: 0,
    byType: [],
    byStatus: [],
    byPriority: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<ControlPoint | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [form] = Form.useForm();

  // 模拟重点布控点数据
  const mockControlPoints: ControlPoint[] = [
    {
      id: 'CP001',
      name: '邹城市第一中学',
      type: 'school',
      location: '邹城市第一中学',
      address: '山东省济宁市邹城市第一中学',
      status: 'active',
      cameraCount: 12,
      onlineCameras: 12,
      alertCount: 5,
      lastAlert: '2025-01-15 14:30:25',
      priority: 'high',
      description: '重点学校布控点，覆盖学校周边500米范围',
      coordinates: [116.973, 35.405],
      coverage: 95,
      imageUrl: '/images/monitor/building.png'
    },
    {
      id: 'CP002',
      name: '邹城市人民广场',
      type: 'square',
      location: '邹城市人民广场',
      address: '山东省济宁市邹城市人民广场',
      status: 'active',
      cameraCount: 8,
      onlineCameras: 7,
      alertCount: 12,
      lastAlert: '2025-01-15 14:25:10',
      priority: 'high',
      description: '城市中心广场，人员密集区域重点监控',
      coordinates: [116.975, 35.408],
      coverage: 88,
      imageUrl: '/images/monitor/building.png'
    },
    {
      id: 'CP003',
      name: '邹城市实验小学',
      type: 'school',
      location: '邹城市实验小学',
      address: '山东省济宁市邹城市实验小学',
      status: 'active',
      cameraCount: 6,
      onlineCameras: 6,
      alertCount: 3,
      lastAlert: '2025-01-15 14:20:45',
      priority: 'high',
      description: '小学重点布控点，确保学生安全',
      coordinates: [116.971, 35.402],
      coverage: 92,
      imageUrl: '/images/monitor/building.png'
    },
    {
      id: 'CP004',
      name: '邹城市商业步行街',
      type: 'commercial',
      location: '邹城市商业步行街',
      address: '山东省济宁市邹城市商业步行街',
      status: 'active',
      cameraCount: 15,
      onlineCameras: 14,
      alertCount: 8,
      lastAlert: '2025-01-15 14:15:30',
      priority: 'medium',
      description: '商业繁华区域，预防扒窃等违法行为',
      coordinates: [116.977, 35.406],
      coverage: 85,
      imageUrl: '/images/monitor/building.png'
    },
    {
      id: 'CP005',
      name: '邹城市汽车站',
      type: 'transport',
      location: '邹城市汽车站',
      address: '山东省济宁市邹城市汽车站',
      status: 'maintenance',
      cameraCount: 10,
      onlineCameras: 8,
      alertCount: 2,
      lastAlert: '2025-01-15 14:10:15',
      priority: 'medium',
      description: '交通枢纽重点监控，保障旅客安全',
      coordinates: [116.969, 35.400],
      coverage: 78,
      imageUrl: '/images/monitor/building.png'
    }
  ];

  // 模拟统计数据
  const mockStatistics: ControlStatistics = {
    totalPoints: 25,
    activePoints: 23,
    totalCameras: 156,
    onlineCameras: 148,
    todayAlerts: 45,
    byType: [
      { type: 'school', count: 8 },
      { type: 'square', count: 5 },
      { type: 'commercial', count: 6 },
      { type: 'transport', count: 4 },
      { type: 'residential', count: 2 }
    ],
    byStatus: [
      { status: 'active', count: 23 },
      { status: 'inactive', count: 1 },
      { status: 'maintenance', count: 1 }
    ],
    byPriority: [
      { priority: 'high', count: 12 },
      { priority: 'medium', count: 10 },
      { priority: 'low', count: 3 }
    ]
  };

  useEffect(() => {
    setControlPoints(mockControlPoints);
    setStatistics(mockStatistics);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'school': return <UserOutlined />;
      case 'square': return <EnvironmentOutlined />;
      case 'commercial': return <TeamOutlined />;
      case 'transport': return <EnvironmentOutlined />;
      case 'residential': return <UserOutlined />;
      default: return <SecurityScanOutlined />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'school': return '学校';
      case 'square': return '广场';
      case 'commercial': return '商业区';
      case 'transport': return '交通枢纽';
      case 'residential': return '居民区';
      default: return '其他';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'maintenance': return 'orange';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: '布控点名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name: string, record: ControlPoint) => (
        <Space>
          {getTypeIcon(record.type)}
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color="blue">{getTypeName(type)}</Tag>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : status === 'inactive' ? 'error' : 'processing'} 
          text={status === 'active' ? '正常' : status === 'inactive' ? '离线' : '维护中'} 
        />
      ),
    },
    {
      title: '摄像头',
      key: 'cameras',
      width: 120,
      render: (_: any, record: ControlPoint) => (
        <Space direction="vertical" size="small">
          <Text>{record.onlineCameras}/{record.cameraCount}</Text>
          <Progress 
            percent={Math.round((record.onlineCameras / record.cameraCount) * 100)} 
            size="small" 
            status={record.onlineCameras === record.cameraCount ? 'success' : 'exception'}
          />
        </Space>
      ),
    },
    {
      title: '今日预警',
      dataIndex: 'alertCount',
      key: 'alertCount',
      width: 100,
      render: (count: number) => (
        <Tag color={count > 10 ? 'red' : count > 5 ? 'orange' : 'green'}>
          {count} 条
        </Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
    {
      title: '覆盖率',
      dataIndex: 'coverage',
      key: 'coverage',
      width: 100,
      render: (coverage: number) => (
        <Progress 
          percent={coverage} 
          size="small" 
          status={coverage > 90 ? 'success' : coverage > 70 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: ControlPoint) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<VideoCameraOutlined />}
            onClick={() => handleMonitor(record)}
          >
            监控
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetail = (point: ControlPoint) => {
    setSelectedPoint(point);
    setShowDetailModal(true);
  };

  const handleEdit = (point: ControlPoint) => {
    setSelectedPoint(point);
    form.setFieldsValue(point);
    setShowEditModal(true);
  };

  const handleMonitor = (point: ControlPoint) => {
    notification.info({
      message: '打开监控',
      description: `正在打开 ${point.name} 的实时监控画面`,
    });
  };

  const handleAdd = () => {
    form.resetFields();
    setShowAddModal(true);
  };

  const handleSave = (values: any) => {
    if (showEditModal && selectedPoint) {
      setControlPoints(prev => prev.map(item => 
        item.id === selectedPoint.id ? { ...item, ...values } : item
      ));
      notification.success({
        message: '更新成功',
        description: '布控点信息已更新',
      });
    } else {
      const newPoint: ControlPoint = {
        id: `CP${Date.now()}`,
        ...values,
        status: 'active',
        cameraCount: 0,
        onlineCameras: 0,
        alertCount: 0,
        lastAlert: '',
        coordinates: [116.973, 35.405],
        coverage: 0,
      };
      setControlPoints(prev => [newPoint, ...prev]);
      notification.success({
        message: '添加成功',
        description: '新布控点已添加',
      });
    }
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleDelete = (point: ControlPoint) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除布控点 "${point.name}" 吗？`,
      onOk: () => {
        setControlPoints(prev => prev.filter(item => item.id !== point.id));
        notification.success({
          message: '删除成功',
          description: '布控点已删除',
        });
      },
    });
  };

  const typeChartData = statistics.byType.map(item => ({
    type: getTypeName(item.type),
    value: item.count,
  }));

  const statusChartData = statistics.byStatus.map(item => ({
    status: item.status === 'active' ? '正常' : item.status === 'inactive' ? '离线' : '维护中',
    value: item.count,
  }));

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Flex justify="space-between" align="center">
          <Title level={2} style={{ margin: 0 }}>
            <SecurityScanOutlined style={{ marginRight: '8px' }} />
            重点布控
          </Title>
          <Space>
            <Button 
              icon={soundEnabled ? <SoundOutlined /> : <AudioMutedOutlined />}
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? '关闭声音' : '开启声音'}
            />
            <Button 
              icon={autoRefresh ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => setAutoRefresh(!autoRefresh)}
              title={autoRefresh ? '暂停自动刷新' : '开启自动刷新'}
            />
            <Button 
              icon={<FilterOutlined />}
            >
              筛选
            </Button>
            <Button 
              icon={<ExportOutlined />}
            >
              导出
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              添加布控点
            </Button>
          </Space>
        </Flex>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="布控点总数"
              value={statistics.totalPoints}
              prefix={<SecurityScanOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线布控点"
              value={statistics.activePoints}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="摄像头总数"
              value={statistics.totalCameras}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日预警"
              value={statistics.todayAlerts}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card title="布控点类型分布" size="small">
            <Pie
              data={typeChartData}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{
                content: (item: any) => `${item.name} ${item.percentage}`,
              }}

            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="布控点状态分布" size="small">
            <Column
              data={statusChartData}
              xField="status"
              yField="value"
              label={{
                position: 'top',
                style: {
                  fill: '#FFFFFF',
                  opacity: 0.6,
                },
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="摄像头在线率趋势" size="small">
            <Line
              data={[
                { time: '00:00', rate: 95 },
                { time: '04:00', rate: 92 },
                { time: '08:00', rate: 98 },
                { time: '12:00', rate: 96 },
                { time: '16:00', rate: 94 },
                { time: '20:00', rate: 97 },
              ]}
              xField="time"
              yField="rate"
            />
          </Card>
        </Col>
      </Row>

      {/* 布控点列表 */}
      <Card title="布控点管理" extra={
        <Space>
          <Text>共 {controlPoints.length} 个布控点</Text>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>
            刷新
          </Button>
        </Space>
      }>
        <Table
          columns={columns}
          dataSource={controlPoints}
          rowKey="id"
          loading={loading}
          pagination={{
            total: controlPoints.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 布控点详情模态框 */}
      <Modal
        title="布控点详情"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowDetailModal(false)}>
            关闭
          </Button>,
          <Button key="edit" type="primary" onClick={() => selectedPoint && handleEdit(selectedPoint)}>
            编辑
          </Button>,
        ]}
        width={800}
      >
        {selectedPoint && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Descriptions column={1}>
                  <Descriptions.Item label="布控点名称">{selectedPoint.name}</Descriptions.Item>
                  <Descriptions.Item label="类型">
                    <Tag color="blue">{getTypeName(selectedPoint.type)}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="位置">{selectedPoint.location}</Descriptions.Item>
                  <Descriptions.Item label="详细地址">{selectedPoint.address}</Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Badge 
                      status={selectedPoint.status === 'active' ? 'success' : selectedPoint.status === 'inactive' ? 'error' : 'processing'} 
                      text={selectedPoint.status === 'active' ? '正常' : selectedPoint.status === 'inactive' ? '离线' : '维护中'} 
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="优先级">
                    <Tag color={getPriorityColor(selectedPoint.priority)}>
                      {selectedPoint.priority === 'high' ? '高' : selectedPoint.priority === 'medium' ? '中' : '低'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions column={1}>
                  <Descriptions.Item label="摄像头数量">{selectedPoint.cameraCount}</Descriptions.Item>
                  <Descriptions.Item label="在线摄像头">{selectedPoint.onlineCameras}</Descriptions.Item>
                  <Descriptions.Item label="今日预警">{selectedPoint.alertCount}</Descriptions.Item>
                  <Descriptions.Item label="最后预警">{selectedPoint.lastAlert || '无'}</Descriptions.Item>
                  <Descriptions.Item label="覆盖率">{selectedPoint.coverage}%</Descriptions.Item>
                  <Descriptions.Item label="坐标">{selectedPoint.coordinates.join(', ')}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            <Divider />
            <p><strong>描述:</strong></p>
            <p>{selectedPoint.description}</p>
            {selectedPoint.imageUrl && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>现场图片:</strong></p>
                <Image src={selectedPoint.imageUrl} alt="现场图片" width={200} />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 添加/编辑布控点模态框 */}
      <Modal
        title={showEditModal ? '编辑布控点' : '添加布控点'}
        open={showAddModal || showEditModal}
        onCancel={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="布控点名称" rules={[{ required: true }]}>
                <Input placeholder="请输入布控点名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                <Select placeholder="选择类型">
                  <Option value="school">学校</Option>
                  <Option value="square">广场</Option>
                  <Option value="commercial">商业区</Option>
                  <Option value="transport">交通枢纽</Option>
                  <Option value="residential">居民区</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="location" label="位置" rules={[{ required: true }]}>
                <Input placeholder="请输入位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
                <Select placeholder="选择优先级">
                  <Option value="high">高</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="详细地址" rules={[{ required: true }]}>
            <Input placeholder="请输入详细地址" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描述信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KeyControl; 