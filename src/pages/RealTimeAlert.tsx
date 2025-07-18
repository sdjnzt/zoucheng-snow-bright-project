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
  DatePicker,
  Row,
  Col,
  Statistic,
  Alert,
  Timeline,
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
  MenuProps
} from 'antd';
import {
  AlertOutlined,
  BellOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  SettingOutlined,
  ReloadOutlined,
  FilterOutlined,
  ExportOutlined,
  FullscreenOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  AudioMutedOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/plots';
import { getDefaultMonitorVideo } from '../utils/videoUtils';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface AlertRecord {
  id: string;
  type: 'person' | 'vehicle' | 'behavior' | 'crowd' | 'safety';
  level: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  timestamp: string;
  status: 'active' | 'processing' | 'resolved' | 'false_alarm';
  cameraId: string;
  cameraName: string;
  confidence: number;
  imageUrl?: string;
  videoUrl?: string;
  assignedTo?: string;
  processingTime?: number;
  remarks?: string;
}

interface AlertStatistics {
  total: number;
  active: number;
  resolved: number;
  falseAlarm: number;
  byLevel: { level: string; count: number }[];
  byType: { type: string; count: number }[];
  byLocation: { location: string; count: number }[];
}

const RealTimeAlert: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [statistics, setStatistics] = useState<AlertStatistics>({
    total: 0,
    active: 0,
    resolved: 0,
    falseAlarm: 0,
    byLevel: [],
    byType: [],
    byLocation: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');

  // 模拟预警数据
  const mockAlerts: AlertRecord[] = [
    {
      id: 'ALT001',
      type: 'person',
      level: 'high',
      location: '邹城市第一中学-东门',
      description: '检测到可疑人员徘徊，疑似在观察学校周边环境',
      timestamp: '2025-01-15 14:30:25',
      status: 'active',
      cameraId: 'CAM001',
      cameraName: '一中东门监控-01',
      confidence: 87.5,
      imageUrl: getDefaultMonitorVideo(),
      assignedTo: '张警官'
    },
    {
      id: 'ALT002',
      type: 'crowd',
      level: 'medium',
      location: '邹城市人民广场-中心区域',
      description: '广场人员密度异常，超过安全阈值',
      timestamp: '2025-01-15 14:28:10',
      status: 'processing',
      cameraId: 'CAM015',
      cameraName: '广场中心监控-03',
      confidence: 92.3,
      processingTime: 120,
      assignedTo: '李警官'
    },
    {
      id: 'ALT003',
      type: 'vehicle',
      level: 'critical',
      location: '邹城市实验小学-南门',
      description: '检测到未授权车辆在校门口长时间停留',
      timestamp: '2025-01-15 14:25:45',
      status: 'active',
      cameraId: 'CAM008',
      cameraName: '实验小学南门监控-02',
      confidence: 95.8,
      assignedTo: '王警官'
    },
    {
      id: 'ALT004',
      type: 'behavior',
      level: 'high',
      location: '邹城市商业步行街-中段',
      description: '检测到异常行为模式，疑似扒窃行为',
      timestamp: '2025-01-15 14:22:30',
      status: 'resolved',
      cameraId: 'CAM023',
      cameraName: '步行街监控-05',
      confidence: 89.2,
      processingTime: 180,
      assignedTo: '赵警官',
      remarks: '已确认并处理，嫌疑人已被控制'
    },
    {
      id: 'ALT005',
      type: 'safety',
      level: 'medium',
      location: '邹城市体育中心-停车场',
      description: '检测到车辆碰撞风险，两车距离过近',
      timestamp: '2025-01-15 14:20:15',
      status: 'false_alarm',
      cameraId: 'CAM031',
      cameraName: '体育中心停车场监控-01',
      confidence: 76.4,
      processingTime: 90,
      assignedTo: '陈警官',
      remarks: '误报，车辆正常停车'
    }
  ];

  // 模拟统计数据
  const mockStatistics: AlertStatistics = {
    total: 156,
    active: 23,
    resolved: 128,
    falseAlarm: 5,
    byLevel: [
      { level: 'critical', count: 8 },
      { level: 'high', count: 45 },
      { level: 'medium', count: 78 },
      { level: 'low', count: 25 }
    ],
    byType: [
      { type: 'person', count: 52 },
      { type: 'vehicle', count: 38 },
      { type: 'behavior', count: 29 },
      { type: 'crowd', count: 24 },
      { type: 'safety', count: 13 }
    ],
    byLocation: [
      { location: '学校周边', count: 45 },
      { location: '商业区域', count: 38 },
      { location: '广场公园', count: 32 },
      { location: '交通枢纽', count: 28 },
      { location: '其他区域', count: 13 }
    ]
  };

  useEffect(() => {
    setAlerts(mockAlerts);
    setStatistics(mockStatistics);
  }, []);

  // 模拟实时数据更新
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // 模拟新预警产生
      const newAlert: AlertRecord = {
        id: `ALT${Date.now()}`,
        type: ['person', 'vehicle', 'behavior', 'crowd', 'safety'][Math.floor(Math.random() * 5)] as any,
        level: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        location: '邹城市监控区域',
        description: '检测到新的安全预警事件',
        timestamp: new Date().toLocaleString(),
        status: 'active',
        cameraId: `CAM${Math.floor(Math.random() * 100)}`,
        cameraName: `监控点-${Math.floor(Math.random() * 100)}`,
        confidence: Math.floor(Math.random() * 100),
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 49)]);
      
      // 播放预警声音
      if (soundEnabled) {
        notification.warning({
          message: '新预警',
          description: newAlert.description,
          duration: 3,
        });
      }
    }, 10000); // 每10秒模拟一个新预警

    return () => clearInterval(interval);
  }, [autoRefresh, soundEnabled]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'blue';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'person': return <UserOutlined />;
      case 'vehicle': return <EnvironmentOutlined />;
      case 'behavior': return <SafetyOutlined />;
      case 'crowd': return <TeamOutlined />;
      case 'safety': return <SafetyOutlined />;
      default: return <AlertOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'red';
      case 'processing': return 'orange';
      case 'resolved': return 'green';
      case 'false_alarm': return 'gray';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: '预警类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Space>
          {getTypeIcon(type)}
          <span>{type === 'person' ? '人员' : type === 'vehicle' ? '车辆' : type === 'behavior' ? '行为' : type === 'crowd' ? '人群' : '安全'}</span>
        </Space>
      ),
    },
    {
      title: '预警级别',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => (
        <Tag color={getLevelColor(level)}>
          {level === 'critical' ? '紧急' : level === 'high' ? '高' : level === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'error' : status === 'processing' ? 'processing' : status === 'resolved' ? 'success' : 'default'} 
          text={status === 'active' ? '活跃' : status === 'processing' ? '处理中' : status === 'resolved' ? '已解决' : '误报'} 
        />
      ),
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 100,
      render: (confidence: number) => (
        <Progress 
          percent={confidence} 
          size="small" 
          status={confidence > 90 ? 'success' : confidence > 70 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: AlertRecord) => (
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
            icon={<CheckCircleOutlined />}
            onClick={() => handleResolve(record)}
          >
            处理
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetail = (alert: AlertRecord) => {
    setSelectedAlert(alert);
    setShowDetailModal(true);
  };

  const handleResolve = (alert: AlertRecord) => {
    Modal.confirm({
      title: '确认处理预警',
      content: `确定要将预警 ${alert.id} 标记为已处理吗？`,
      onOk: () => {
        setAlerts(prev => prev.map(item => 
          item.id === alert.id ? { ...item, status: 'resolved' as any } : item
        ));
        notification.success({
          message: '处理成功',
          description: '预警已标记为已处理',
        });
      },
    });
  };

  const handleFilter = (values: any) => {
    console.log('Filter values:', values);
    setShowFilterDrawer(false);
  };

  const handleExport = () => {
    notification.success({
      message: '导出成功',
      description: '预警数据已导出到Excel文件',
    });
  };

  const levelChartData = statistics.byLevel.map(item => ({
    type: item.level === 'critical' ? '紧急' : item.level === 'high' ? '高' : item.level === 'medium' ? '中' : '低',
    value: item.count,
  }));

  const typeChartData = statistics.byType.map(item => ({
    type: item.type === 'person' ? '人员' : item.type === 'vehicle' ? '车辆' : item.type === 'behavior' ? '行为' : item.type === 'crowd' ? '人群' : '安全',
    value: item.count,
  }));

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Flex justify="space-between" align="center">
          <Title level={2} style={{ margin: 0 }}>
            <AlertOutlined style={{ marginRight: '8px' }} />
            实时预警
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
              onClick={() => setShowFilterDrawer(true)}
            >
              筛选
            </Button>
            <Button 
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出
            </Button>
          </Space>
        </Flex>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总预警数"
              value={statistics.total}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃预警"
              value={statistics.active}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已处理"
              value={statistics.resolved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="误报数"
              value={statistics.falseAlarm}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card title="预警级别分布" size="small">
            <Pie
              data={levelChartData}
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
          <Card title="预警类型分布" size="small">
            <Column
              data={typeChartData}
              xField="type"
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
          <Card title="实时预警趋势" size="small">
            <Line
              data={[
                { time: '00:00', count: 12 },
                { time: '04:00', count: 8 },
                { time: '08:00', count: 25 },
                { time: '12:00', count: 35 },
                { time: '16:00', count: 28 },
                { time: '20:00', count: 18 },
              ]}
              xField="time"
              yField="count"
            />
          </Card>
        </Col>
      </Row>

      {/* 预警列表 */}
      <Card title="预警记录" extra={
        <Space>
          <Text>共 {alerts.length} 条记录</Text>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>
            刷新
          </Button>
        </Space>
      }>
        <Table
          columns={columns}
          dataSource={alerts}
          rowKey="id"
          loading={loading}
          pagination={{
            total: alerts.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 预警详情模态框 */}
      <Modal
        title="预警详情"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowDetailModal(false)}>
            关闭
          </Button>,
          <Button key="resolve" type="primary" onClick={() => selectedAlert && handleResolve(selectedAlert)}>
            标记处理
          </Button>,
        ]}
        width={800}
      >
        {selectedAlert && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>预警ID:</strong> {selectedAlert.id}</p>
                <p><strong>预警类型:</strong> {selectedAlert.type}</p>
                <p><strong>预警级别:</strong> 
                  <Tag color={getLevelColor(selectedAlert.level)} style={{ marginLeft: '8px' }}>
                    {selectedAlert.level === 'critical' ? '紧急' : selectedAlert.level === 'high' ? '高' : selectedAlert.level === 'medium' ? '中' : '低'}
                  </Tag>
                </p>
                <p><strong>位置:</strong> {selectedAlert.location}</p>
                <p><strong>摄像头:</strong> {selectedAlert.cameraName}</p>
                <p><strong>置信度:</strong> {selectedAlert.confidence}%</p>
              </Col>
              <Col span={12}>
                <p><strong>时间:</strong> {selectedAlert.timestamp}</p>
                <p><strong>状态:</strong> 
                  <Badge 
                    status={selectedAlert.status === 'active' ? 'error' : selectedAlert.status === 'processing' ? 'processing' : selectedAlert.status === 'resolved' ? 'success' : 'default'} 
                    text={selectedAlert.status === 'active' ? '活跃' : selectedAlert.status === 'processing' ? '处理中' : selectedAlert.status === 'resolved' ? '已解决' : '误报'} 
                    style={{ marginLeft: '8px' }}
                  />
                </p>
                <p><strong>处理人:</strong> {selectedAlert.assignedTo || '未分配'}</p>
                {selectedAlert.processingTime && (
                  <p><strong>处理时间:</strong> {selectedAlert.processingTime}秒</p>
                )}
                {selectedAlert.remarks && (
                  <p><strong>备注:</strong> {selectedAlert.remarks}</p>
                )}
              </Col>
            </Row>
            <Divider />
            <p><strong>描述:</strong></p>
            <p>{selectedAlert.description}</p>
            {selectedAlert.imageUrl && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>现场图片:</strong></p>
                <img src={selectedAlert.imageUrl} alt="现场图片" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 筛选抽屉 */}
      <Drawer
        title="筛选条件"
        placement="right"
        onClose={() => setShowFilterDrawer(false)}
        open={showFilterDrawer}
        width={400}
      >
        <Form
          form={filterForm}
          layout="vertical"
          onFinish={handleFilter}
        >
          <Form.Item name="type" label="预警类型">
            <Select placeholder="选择预警类型" allowClear>
              <Option value="person">人员</Option>
              <Option value="vehicle">车辆</Option>
              <Option value="behavior">行为</Option>
              <Option value="crowd">人群</Option>
              <Option value="safety">安全</Option>
            </Select>
          </Form.Item>
          <Form.Item name="level" label="预警级别">
            <Select placeholder="选择预警级别" allowClear>
              <Option value="critical">紧急</Option>
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="处理状态">
            <Select placeholder="选择处理状态" allowClear>
              <Option value="active">活跃</Option>
              <Option value="processing">处理中</Option>
              <Option value="resolved">已解决</Option>
              <Option value="false_alarm">误报</Option>
            </Select>
          </Form.Item>
          <Form.Item name="timeRange" label="时间范围">
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              应用筛选
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default RealTimeAlert; 