import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Tag, 
  Progress, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Space, 
  Statistic, 
  Timeline, 
  Tabs, 
  Alert, 
  Tooltip, 
  Badge,
  Typography,
  Divider,
  message,
  Switch
} from 'antd';
import { 
  AuditOutlined,
  CheckCircleOutlined, 
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  BarChartOutlined,
  FileTextOutlined,
  WarningOutlined,
  SettingOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  ToolOutlined,
  FileProtectOutlined,
  BookOutlined,
  TrophyOutlined,
  RocketOutlined,
  HeartOutlined,
  VideoCameraOutlined,
  CarOutlined,
  BellOutlined,
  CloudOutlined
} from '@ant-design/icons';
import { Pie, Column, Line } from '@ant-design/plots';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 雪亮工程巡检记录数据
const inspectionRecords = [
  { id: 'INS01', title: '监控摄像头设备巡检', location: '邹城市政府广场', type: 'routine', inspector: '张工程师', department: '技术部', priority: 'medium', status: 'completed', scheduledDate: '2023-10-15', completedDate: '2023-10-15', score: 95, description: '检查监控摄像头运行状态、图像质量、存储功能等', findings: '设备运行正常，图像清晰度良好', recommendations: '建议定期清洁镜头，优化存储空间' },
  { id: 'INS02', title: '人脸识别系统巡检', location: '邹城火车站', type: 'special', inspector: '李技术员', department: '技术部', priority: 'high', status: 'in_progress', scheduledDate: '2023-10-15', description: '检查人脸识别系统识别率、数据库连接、报警功能等', findings: '识别率稳定在92%', recommendations: '建议优化夜间识别算法' },
  { id: 'INS03', title: '车牌识别设备巡检', location: '邹城市高速入口', type: 'routine', inspector: '王维护员', department: '维护部', priority: 'medium', status: 'scheduled', scheduledDate: '2023-10-16', description: '检查车牌识别设备、数据传输、存储系统等', findings: '', recommendations: '' },
  { id: 'INS004', title: '对讲设备系统巡检', location: '邹城市商业步行街', type: 'routine', inspector: '赵工程师', department: '技术部', priority: 'low', status: 'overdue', scheduledDate: '2023-10-14', description: '检查对讲设备信号强度、通话质量、覆盖范围等', findings: '设备信号良好，通话清晰', recommendations: '建议增加信号放大器' },
  { id: 'INS05', title: '应急报警系统巡检', location: '邹城市建设银行', type: 'emergency', inspector: '陈安全员', department: '安全部', priority: 'urgent', status: 'completed', scheduledDate: '2023-10-15', completedDate: '2023-10-15', score: 98, description: '检查应急报警系统、联动功能、响应时间等', findings: '系统响应迅速，联动功能正常', recommendations: '建议定期测试报警功能' }
];

// 整改项目数据
const rectificationItems = [
  { id: 'REC01', title: '监控设备镜头清洁', location: '邹城市政府广场', type: 'maintenance', assignee: '张工程师', priority: 'medium', status: 'pending', dueDate: '2023-10-20', description: '清洁监控摄像头镜头，提高图像清晰度', progress: 0 },
  { id: 'REC02', title: '人脸识别算法优化', location: '邹城火车站', type: 'upgrade', assignee: '李技术员', priority: 'high', status: 'in_progress', dueDate: '2023-10-25', description: '优化夜间人脸识别算法，提高识别准确率', progress: 60 },
  { id: 'REC03', title: '信号放大器安装', location: '邹城市商业步行街', type: 'installation', assignee: '赵工程师', priority: 'low', status: 'completed', dueDate: '2023-10-18', description: '安装信号放大器，改善对讲设备信号覆盖', progress: 100 }
];

const InspectionManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isInspectionModalVisible, setIsInspectionModalVisible] = useState(false);
  const [isRectificationModalVisible, setIsRectificationModalVisible] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [selectedRectification, setSelectedRectification] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [inspectionForm] = Form.useForm();
  const [rectificationForm] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 统计数据
  const totalInspections = inspectionRecords.length;
  const completedInspections = inspectionRecords.filter(r => r.status === 'completed').length;
  const overdueInspections = inspectionRecords.filter(r => r.status === 'overdue').length;
  const pendingRectifications = rectificationItems.filter(r => r.status === 'pending').length; 
  const completionRate = Math.round((completedInspections / totalInspections) * 100);

  // 模拟实时数据更新
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // 模拟数据更新
        console.log('巡检数据已更新');
      }, 30000); // 每30秒更新一次
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // 检查记录表格列配置
  const inspectionColumns = [
    {
      title: '检查编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <Text code style={{ fontSize: '12px' }}>{id}</Text>
      )
    },
    {
      title: '检查标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (title: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#262626' }}>{title}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.location}
          </Text>
        </div>
      )
    },
    {
      title: '检查类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeConfig = {
          routine: { color: 'blue', text: '例行巡检', icon: <CalendarOutlined /> },
          special: { color: 'orange', text: '专项巡检', icon: <AuditOutlined /> },
          emergency: { color: 'red', text: '紧急巡检', icon: <WarningOutlined /> },
          annual: { color: 'purple', text: '年度巡检', icon: <TrophyOutlined /> }
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: '检查员',
      dataIndex: 'inspector',
      key: 'inspector',
      width: 100,
      render: (inspector: string, record: any) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text strong style={{ fontSize: '13px' }}>{inspector}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {record.department}
          </Text>
        </div>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => {
        const priorityConfig = {
          low: { color: 'green', text: '低' },
          medium: { color: 'blue', text: '中' },
          high: { color: 'orange', text: '高' },
          urgent: { color: 'red', text: '紧急' }
        };
        const config = priorityConfig[priority as keyof typeof priorityConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record: any) => {
        const statusConfig = {
          scheduled: { color: 'default', text: '已安排', icon: <ClockCircleOutlined /> },
          in_progress: { color: 'processing', text: '进行中', icon: <ReloadOutlined spin /> },
          completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
          overdue: { color: 'error', text: '已逾期', icon: <ExclamationCircleOutlined /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <div>
            <Tag color={config.color} icon={config.icon}>
              {config.text}
            </Tag>
            {record.score && (
              <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                评分: {record.score}分
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: '检查时间',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      width: 100,
      render: (date: string, record: any) => (
        <div>
          <div style={{ fontSize: '12px' }}>{date}</div>
          {record.completedDate && (
            <Text type="secondary" style={{ fontSize: '11px' }}>
              完成: {record.completedDate}
            </Text>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewInspection(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditInspection(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 整改项目表格列配置
  const rectificationColumns = [
    {
      title: '整改编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <Text code style={{ fontSize: '12px' }}>{id}</Text>
      )
    },
    {
      title: '整改项目',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (title: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#262626' }}>{title}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.location}
          </Text>
        </div>
      )
    },
    {
      title: '整改类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeConfig = {
          maintenance: { color: 'blue', text: '维护', icon: <ToolOutlined /> },
          upgrade: { color: 'orange', text: '升级', icon: <RocketOutlined /> },
          installation: { color: 'green', text: '安装', icon: <SettingOutlined /> },
          repair: { color: 'red', text: '维修', icon: <WarningOutlined /> }
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 100,
      render: (assignee: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text strong style={{ fontSize: '13px' }}>{assignee}</Text>
        </div>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => {
        const priorityConfig = {
          low: { color: 'green', text: '低' },
          medium: { color: 'blue', text: '中' },
          high: { color: 'orange', text: '高' },
          urgent: { color: 'red', text: '紧急' }
        };
        const config = priorityConfig[priority as keyof typeof priorityConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record: any) => {
        const statusConfig = {
          pending: { color: 'default', text: '待处理', icon: <ClockCircleOutlined /> },
          in_progress: { color: 'processing', text: '处理中', icon: <ReloadOutlined spin /> },
          completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
          verified: { color: 'success', text: '已验证', icon: <CheckCircleOutlined /> },
          closed: { color: 'success', text: '已关闭', icon: <CheckCircleOutlined /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <div>
            <Tag color={config.color} icon={config.icon}>
              {config.text}
            </Tag>
            {record.progress !== undefined && (
              <Progress 
                percent={record.progress} 
                size="small" 
                status={record.status === 'completed' ? 'success' : 'active'}
                showInfo={false}
                style={{ marginTop: '4px' }}
              />
            )}
          </div>
        );
      }
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 100,
      render: (date: string) => (
        <div style={{ fontSize: '12px' }}>{date}</div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewRectification(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditRectification(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 事件处理函数
  const handleViewInspection = (record: any) => {
    setSelectedInspection(record);
    setIsViewMode(true);
    setIsInspectionModalVisible(true);
  };

  const handleEditInspection = (record: any) => {
    setSelectedInspection(record);
    setIsViewMode(false);
    inspectionForm.setFieldsValue(record);
    setIsInspectionModalVisible(true);
  };

  const handleViewRectification = (record: any) => {
    setSelectedRectification(record);
    setIsViewMode(true);
    setIsRectificationModalVisible(true);
  };

  const handleEditRectification = (record: any) => {
    setSelectedRectification(record);
    setIsViewMode(false);
    rectificationForm.setFieldsValue(record);
    setIsRectificationModalVisible(true);
  };

  const handleNewInspection = () => {
    setSelectedInspection(null);
    setIsViewMode(false);
    inspectionForm.resetFields();
    setIsInspectionModalVisible(true);
  };

  const handleNewRectification = () => {
    setSelectedRectification(null);
    setIsViewMode(false);
    rectificationForm.resetFields();
    setIsRectificationModalVisible(true);
  };

  const handleInspectionModalOk = () => {
    if (isViewMode) {
      setIsInspectionModalVisible(false);
      return;
    }
    inspectionForm.validateFields().then(() => {
      console.log('巡检记录:', inspectionForm.getFieldsValue());
      message.success('巡检记录保存成功');
      setIsInspectionModalVisible(false);
      inspectionForm.resetFields();
    });
  };

  const handleRectificationModalOk = () => {
    if (isViewMode) {
      setIsRectificationModalVisible(false);
      return;
    }
    rectificationForm.validateFields().then(() => {
      console.log('整改项目:', rectificationForm.getFieldsValue());
      message.success('整改项目保存成功');
      setIsRectificationModalVisible(false);
      rectificationForm.resetFields();
    });
  };

  // 过滤数据
  const filteredInspections = filterStatus === 'all' 
    ? inspectionRecords 
    : inspectionRecords.filter(record => record.status === filterStatus);

  // 图表配置
  const inspectionStatsConfig = {
    data: [
      { status: '已完成', count: completedInspections },
      { status: '已逾期', count: overdueInspections },
      { status: '进行中', count: inspectionRecords.filter(r => r.status === 'in_progress').length },
      { status: '已安排', count: inspectionRecords.filter(r => r.status === 'scheduled').length }
    ],
    angleField: 'count',
    colorField: 'status',
    radius: 0.8,
    label: {
      content: (data: any) => `${data.status}\n${data.count}`,
    },
    interactions: [{ type: 'element-active' }],
    color: ['#52c41a', '#ff4d4f', '#faad14', '#1890ff']
  };

  const rectificationStatsConfig = {
    data: [
      { status: '待处理', count: pendingRectifications },
      { status: '处理中', count: rectificationItems.filter(r => r.status === 'in_progress').length },
      { status: '已完成', count: rectificationItems.filter(r => r.status === 'completed').length },
      { status: '已关闭', count: rectificationItems.filter(r => r.status === 'closed').length }
    ],
    xField: 'status',
    yField: 'count',
    color: '#1890ff',
    columnWidthRatio: 0.6,
    label: {
      position: 'inside' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>雪亮工程巡检管理中心</h2>
        <Space>
          <Switch
            checked={autoRefresh}
            onChange={setAutoRefresh}
            checkedChildren="自动刷新"
            unCheckedChildren="手动刷新"
          />
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => message.success('数据已刷新')}
          >
            刷新
          </Button>
        </Space>
      </div>

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span style={{ color: '#666', fontSize: '14px' }}>
                  <AuditOutlined style={{ marginRight: 4, color: '#1890ff' }} />
                  总巡检数
                </span>
              }
              value={totalInspections}
              valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
              suffix="项"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span style={{ color: '#666', fontSize: '14px' }}>
                  <CheckCircleOutlined style={{ marginRight: 4, color: '#52c41a' }} />
                  已完成
                </span>
              }
              value={completedInspections}
              valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
              suffix={`/ ${totalInspections}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span style={{ color: '#666', fontSize: '14px' }}>
                  <BarChartOutlined style={{ marginRight: 4, color: '#fa8c16' }} />
                  完成率
                </span>
              }
              value={completionRate}
              valueStyle={{ color: '#fa8c16', fontSize: '28px', fontWeight: 'bold' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span style={{ color: '#666', fontSize: '14px' }}>
                  <ExclamationCircleOutlined style={{ marginRight: 4, color: '#ff4d4f' }} />
                  逾期巡检
                </span>
              }
              value={overdueInspections}
              valueStyle={{ color: '#ff4d4f', fontSize: '28px', fontWeight: 'bold' }}
              suffix="项"
            />
          </Card>
        </Col>
      </Row>

      {/* 性能指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span style={{ color: '#666', fontSize: '14px' }}>
                  <ToolOutlined style={{ marginRight: 4, color: '#faad14' }} />
                  待整改项目
                </span>
              }
              value={pendingRectifications}
              valueStyle={{ color: '#faad14', fontSize: '28px', fontWeight: 'bold' }}
              suffix="项"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span style={{ color: '#666', fontSize: '14px' }}>
                  <VideoCameraOutlined style={{ marginRight: 4, color: '#1890ff' }} />
                  在线设备
                </span>
              }
              value={23}
              valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span style={{ color: '#666', fontSize: '14px' }}>
                  <CloudOutlined style={{ marginRight: 4, color: '#52c41a' }} />
                  系统可用性
                </span>
              }
              value={99.2}
              valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span style={{ color: '#666', fontSize: '14px' }}>
                  <BellOutlined style={{ marginRight: 4, color: '#722' }} />
                  平均响应时间
                </span>
              }
              value={1.8}
              valueStyle={{ color: '#722', fontSize: '28px', fontWeight: 'bold' }}
              suffix="分钟"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 逾期告警 */}
      {overdueInspections > 0 && (
        <Alert
          message={`有 ${overdueInspections} 项巡检已逾期`}
          description="请及时处理逾期巡检项目，确保系统正常运行"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button 
              size="small" 
              type="primary" 
              onClick={() => setFilterStatus('overdue')} 
            >
              查看详情
            </Button>
          }
        />
      )}

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={selectedTab} onChange={setSelectedTab}>
          <TabPane tab={<span><AuditOutlined />巡检概览</span>} key="overview">
            <Row gutter={16}>
              <Col span={16}>
                <Card title="巡检记录" size="small" extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleNewInspection}>
                    新建巡检
                  </Button>
                }>
                  <Table
                    dataSource={inspectionRecords}
                    columns={inspectionColumns}
                    pagination={{ pageSize: 8 }}
                    scroll={{ x: 1200 }}
                    size="small"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="巡检统计" size="small">
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>巡检完成率</span>
                      <span>{completionRate}%</span>
                    </div>
                    <Progress percent={completionRate} size="small" />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>设备健康度</span>
                      <span>96.5%</span>
                    </div>
                    <Progress percent={96.5} size="small" strokeColor="#52c41a" />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>系统稳定性</span>
                      <span>99.2%</span>
                    </div>
                    <Progress percent={99.2} size="small" strokeColor="#1890ff" />
                  </div>

                  <Divider />

                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    巡检进度
                  </div>
                  <Timeline>
                    <Timeline.Item color="green">
                      <div>监控设备巡检 - 正常</div>
                      <div style={{ fontSize: 12, color: '#666' }}>2023-10-15</div>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      <div>人脸识别系统巡检 - 进行中</div>
                      <div style={{ fontSize: 12, color: '#666' }}>2023-10-15</div>
                    </Timeline.Item>
                    <Timeline.Item color="orange">
                      <div>车牌识别设备巡检 - 待安排</div>
                      <div style={{ fontSize: 12, color: '#666' }}>2023-10-16</div>
                    </Timeline.Item>
                  </Timeline>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><ToolOutlined />整改管理</span>} key="rectification">
            <Row gutter={16}>
              <Col span={16}>
                <Card title="整改项目" size="small" extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleNewRectification}>
                    新建整改
                  </Button>
                }>
                  <Table
                    dataSource={rectificationItems}
                    columns={rectificationColumns}
                    pagination={{ pageSize: 8 }}
                    scroll={{ x: 1200 }}
                    size="small"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="整改统计" size="small">
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>整改完成率</span>
                      <span>33.3%</span>
                    </div>
                    <Progress percent={33.3} size="small" />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>平均处理时间</span>
                      <span>2.5天</span>
                    </div>
                    <Progress percent={75} size="small" strokeColor="#faad14" />
                  </div>

                  <Divider />

                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    整改统计
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    整改类型分布
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>维护</span>
                    <span>1项</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>升级</span>
                    <span>1项</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>安装</span>
                    <span>1项</span>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 巡检记录模态框 */}
      <Modal
        title={
          <Space>
            <AuditOutlined />
            {selectedInspection ? (isViewMode ? '查看巡检记录' : '编辑巡检记录') : '新建巡检记录'}
          </Space>
        }
        visible={isInspectionModalVisible}
        onOk={handleInspectionModalOk}
        onCancel={() => setIsInspectionModalVisible(false)}
        width={600}
      >
        {isViewMode && selectedInspection ? (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <div><strong>检查编号:</strong> {selectedInspection.id}</div>
                <div><strong>检查标题:</strong> {selectedInspection.title}</div>
                <div><strong>检查位置:</strong> {selectedInspection.location}</div>
                <div><strong>检查类型:</strong> {selectedInspection.type}</div>
              </Col>
              <Col span={12}>
                <div><strong>检查员:</strong> {selectedInspection.inspector}</div>
                <div><strong>部门:</strong> {selectedInspection.department}</div>
                <div><strong>优先级:</strong> {selectedInspection.priority}</div>
                <div><strong>状态:</strong> {selectedInspection.status}</div>
              </Col>
            </Row>
            <Divider />
            <div><strong>检查描述:</strong></div>
            <div style={{ marginBottom: 16 }}>{selectedInspection.description}</div>
            {selectedInspection.findings && (
              <>
                <div><strong>检查发现:</strong></div>
                <div style={{ marginBottom: 16 }}>{selectedInspection.findings}</div>
              </>
            )}
            {selectedInspection.recommendations && (
              <>
                <div><strong>建议:</strong></div>
                <div>{selectedInspection.recommendations}</div>
              </>
            )}
          </div>
        ) : (
          <Form form={inspectionForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="检查标题" name="title" rules={[{ required: true, message: '请输入检查标题' }]}>
                  <Input placeholder="请输入检查标题" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="检查位置" name="location" rules={[{ required: true, message: '请输入检查位置' }]}>
                  <Input placeholder="请输入检查位置" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="检查类型" name="type" rules={[{ required: true, message: '请选择检查类型' }]}>
                  <Select placeholder="请选择检查类型">
                    <Option value="routine">例行巡检</Option>
                    <Option value="special">专项巡检</Option>
                    <Option value="emergency">紧急巡检</Option>
                    <Option value="annual">年度巡检</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="优先级" name="priority" rules={[{ required: true, message: '请选择优先级' }]}>
                  <Select placeholder="请选择优先级">
                    <Option value="low">低</Option>
                    <Option value="medium">中</Option>
                    <Option value="high">高</Option>
                    <Option value="urgent">紧急</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="检查描述" name="description" rules={[{ required: true, message: '请输入检查描述' }]}>
              <TextArea rows={3} placeholder="请输入检查描述" />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 整改项目模态框 */}
      <Modal
        title={
          <Space>
            <ToolOutlined />
            {selectedRectification ? (isViewMode ? '查看整改项目' : '编辑整改项目') : '新建整改项目'}
          </Space>
        }
        visible={isRectificationModalVisible}
        onOk={handleRectificationModalOk}
        onCancel={() => setIsRectificationModalVisible(false)}
        width={600}
      >
        {isViewMode && selectedRectification ? (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <div><strong>整改编号:</strong> {selectedRectification.id}</div>
                <div><strong>整改项目:</strong> {selectedRectification.title}</div>
                <div><strong>整改位置:</strong> {selectedRectification.location}</div>
                <div><strong>整改类型:</strong> {selectedRectification.type}</div>
              </Col>
              <Col span={12}>
                <div><strong>负责人:</strong> {selectedRectification.assignee}</div>
                <div><strong>优先级:</strong> {selectedRectification.priority}</div>
                <div><strong>状态:</strong> {selectedRectification.status}</div>
                <div><strong>截止日期:</strong> {selectedRectification.dueDate}</div>
              </Col>
            </Row>
            <Divider />
            <div><strong>整改描述:</strong></div>
            <div>{selectedRectification.description}</div>
          </div>
        ) : (
          <Form form={rectificationForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="整改项目" name="title" rules={[{ required: true, message: '请输入整改项目' }]}>
                  <Input placeholder="请输入整改项目" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="整改位置" name="location" rules={[{ required: true, message: '请输入整改位置' }]}>
                  <Input placeholder="请输入整改位置" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="整改类型" name="type" rules={[{ required: true, message: '请选择整改类型' }]}>
                  <Select placeholder="请选择整改类型">
                    <Option value="maintenance">维护</Option>
                    <Option value="upgrade">升级</Option>
                    <Option value="installation">安装</Option>
                    <Option value="repair">维修</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="优先级" name="priority" rules={[{ required: true, message: '请选择优先级' }]}>
                  <Select placeholder="请选择优先级">
                    <Option value="low">低</Option>
                    <Option value="medium">中</Option>
                    <Option value="high">高</Option>
                    <Option value="urgent">紧急</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="整改描述" name="description" rules={[{ required: true, message: '请输入整改描述' }]}>
              <TextArea rows={3} placeholder="请输入整改描述" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default InspectionManagement; 