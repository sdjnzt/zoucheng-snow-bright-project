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
  MenuProps,
  Checkbox,
  Image,
  Carousel,
  Descriptions,
  Steps,
  Timeline as AntTimeline,
  Popconfirm,
  message,
  Empty,
  Spin,
  Skeleton,
  Collapse,
  Rate,
  Rate as AntRate,
  Slider
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
  TeamOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  StarOutlined,
  StarFilled,
  MessageOutlined,
  PhoneOutlined,
  MailOutlined,
  CameraOutlined,
  CarOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
  FileTextOutlined,
  PictureOutlined,
  AudioOutlined,
  CompressOutlined,
  ExpandOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  FireOutlined,
  HeartOutlined,
  CrownOutlined,
  TrophyOutlined,
  FlagOutlined,
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined as ClockIcon,
  HomeOutlined,
  BankOutlined,
  ShopOutlined,
  CarOutlined as CarIcon,
  UserOutlined as UserIcon,
  TeamOutlined as TeamIcon,
  SafetyOutlined as SafetyIcon,
  ExclamationCircleOutlined as ExclamationIcon,
  TableOutlined
} from '@ant-design/icons';
import { Line, Pie, Column, Area } from '@ant-design/plots';
import { getDefaultMonitorVideo } from '../utils/videoUtils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;
const { Panel } = Collapse;

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
  isRead?: boolean;
  priority?: 'low' | 'medium' | 'high';
  estimatedTime?: number;
  coordinates?: [number, number];
  images?: string[];
  videos?: string[];
  audio?: string;
  tags?: string[];
  history?: AlertHistory[];
  recommendations?: string[];
}

interface AlertHistory {
  id: string;
  action: string;
  operator: string;
  timestamp: string;
  remarks?: string;
}

interface AlertStatistics {
  total: number;
  active: number;
  resolved: number;
  falseAlarm: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byLevel: { level: string; count: number }[];
  byType: { type: string; count: number }[];
  byLocation: { location: string; count: number }[];
  byStatus: { status: string; count: number }[];
  hourlyDistribution: { hour: number; count: number }[];
  responseTime: {
    avg: number;
    min: number;
    max: number;
  };
}

const RealTimeAlert: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [statistics, setStatistics] = useState<AlertStatistics>({
    total: 0,
    active: 0,
    resolved: 0,
    falseAlarm: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    byLevel: [],
    byType: [],
    byLocation: [],
    byStatus: [],
    hourlyDistribution: [],
    responseTime: { avg: 0, min: 0, max: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertRecord | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('card');
  const [searchText, setSearchText] = useState('');
  const [filterValues, setFilterValues] = useState<any>({});
  const [showMap, setShowMap] = useState(false);
  const [newAlertCount, setNewAlertCount] = useState(0);

  // 预警等级颜色配置
  const levelConfig = {
    critical: { color: '#ff4d4f', text: '紧急', icon: <FireOutlined /> },
    high: { color: '#fa8c16', text: '高', icon: <ExclamationIcon /> },
    medium: { color: '#faad14', text: '中', icon: <WarningOutlined /> },
    low: { color: '#1890ff', text: '低', icon: <InfoCircleOutlined /> }
  };

  // 预警类型配置
  const typeConfig = {
    person: { text: '人员', icon: <UserIcon />, color: '#1890ff' },
    vehicle: { text: '车辆', icon: <CarIcon />, color: '#52c41a' },
    behavior: { text: '行为', icon: <TeamIcon />, color: '#fa8c16' },
    crowd: { text: '人群', icon: <TeamIcon />, color: '#722ed1' },
    safety: { text: '安全', icon: <SafetyIcon />, color: '#ff4d4f' }
  };

  // 状态配置
  const statusConfig = {
    active: { text: '待处理', color: '#ff4d4f', icon: <ClockIcon /> },
    processing: { text: '处理中', color: '#fa8c16', icon: <SyncOutlined spin /> },
    resolved: { text: '已解决', color: '#52c41a', icon: <CheckCircleOutlined /> },
    false_alarm: { text: '误报', color: '#d9d9d9', icon: <CloseCircleOutlined /> }
  };

  // 预警数据
  const alertsData: AlertRecord[] = [
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
      assignedTo: '张警官',
      isRead: false,
      priority: 'high',
      estimatedTime: 30,
      coordinates: [116.973, 35.405],
      images: [getDefaultMonitorVideo()],
      videos: [getDefaultMonitorVideo()],
      tags: ['学校', '可疑人员', '徘徊'],
      recommendations: ['立即派遣巡逻人员前往现场', '通知学校安保部门', '调取周边监控录像'],
      history: [
        { id: '1', action: '创建预警', operator: '系统', timestamp: '2025-01-15 14:30:25' },
        { id: '2', action: '指派处理', operator: '张警官', timestamp: '2025-01-15 14:31:00' }
      ]
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
      assignedTo: '李警官',
      isRead: true,
      priority: 'medium',
      estimatedTime: 45,
      coordinates: [116.975, 35.408],
      images: [getDefaultMonitorVideo()],
      tags: ['广场', '人群密集', '安全阈值'],
      recommendations: ['疏散部分人群', '增加安保人员', '监控人群流动'],
      history: [
        { id: '1', action: '创建预警', operator: '系统', timestamp: '2025-01-15 14:28:10' },
        { id: '2', action: '指派处理', operator: '李警官', timestamp: '2025-01-15 14:29:00' },
        { id: '3', action: '开始处理', operator: '李警官', timestamp: '2025-01-15 14:30:00' }
      ]
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
      assignedTo: '王警官',
      isRead: false,
      priority: 'high',
      estimatedTime: 20,
      coordinates: [116.971, 35.402],
      images: [getDefaultMonitorVideo()],
      tags: ['学校', '未授权车辆', '长时间停留'],
      recommendations: ['立即前往现场检查', '联系车主', '必要时拖车处理'],
      history: [
        { id: '1', action: '创建预警', operator: '系统', timestamp: '2025-01-15 14:25:45' },
        { id: '2', action: '指派处理', operator: '王警官', timestamp: '2025-01-15 14:26:00' }
      ]
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
      remarks: '已确认并处理，嫌疑人已被控制',
      isRead: true,
      priority: 'high',
      coordinates: [116.977, 35.406],
      images: [getDefaultMonitorVideo()],
      tags: ['商业街', '扒窃', '异常行为'],
      recommendations: ['加强巡逻密度', '安装更多监控设备', '提高商户安全意识'],
      history: [
        { id: '1', action: '创建预警', operator: '系统', timestamp: '2025-01-15 14:22:30' },
        { id: '2', action: '指派处理', operator: '赵警官', timestamp: '2025-01-15 14:23:00' },
        { id: '3', action: '开始处理', operator: '赵警官', timestamp: '2025-01-15 14:24:00', remarks: '嫌疑人已被控制' }
      ]
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
      remarks: '误报，车辆正常停车',
      isRead: true,
      priority: 'medium',
      coordinates: [116.969, 35.400],
      images: [getDefaultMonitorVideo()],
      tags: ['停车场', '车辆碰撞', '误报'],
      history: [
        { id: '1', action: '创建预警', operator: '系统', timestamp: '2025-01-15 14:20:15' },
        { id: '2', action: '指派处理', operator: '陈警官', timestamp: '2025-01-15 14:21:00' },
        { id: '3', action: '确认误报', operator: '陈警官', timestamp: '2025-01-15 14:22:00', remarks: '车辆正常停车' }
      ]
    }
  ];

  // 统计数据
  const statisticsData: AlertStatistics = {
    total: 156,
    active: 23,
    resolved: 128,
    falseAlarm: 5,
    today: 12,
    thisWeek: 45,
    thisMonth: 156,
    byLevel: [
      { level: 'critical', count: 8 },
      { level: 'high', count: 45 },
      { level: 'medium', count: 78 },
      { level: 'low', count: 25 }
    ],
    byType: [
      { type: 'person', count: 52 },
      { type: 'vehicle', count: 38 },
      { type: 'behavior', count: 28 },
      { type: 'crowd', count: 22 },
      { type: 'safety', count: 16 }
    ],
    byLocation: [
      { location: '邹城市第一中学', count: 25 },
      { location: '邹城市人民广场', count: 20 },
      { location: '邹城市实验小学', count: 18 },
      { location: '邹城市商业步行街', count: 15 },
      { location: '邹城市体育中心', count: 12 }
    ],
    byStatus: [
      { status: 'active', count: 23 },
      { status: 'processing', count: 8 },
      { status: 'resolved', count: 120 },
      { status: 'false_alarm', count: 5 }
    ],
    hourlyDistribution: [
      { hour: 0, count: 5 }, { hour: 1, count: 3 }, { hour: 2, count: 2 },
      { hour: 3, count: 1 }, { hour: 4, count: 2 }, { hour: 5, count: 4 },
      { hour: 6, count: 8 }, { hour: 7, count: 12 }, { hour: 8, count: 15 },
      { hour: 9, count: 18 }, { hour: 10, count: 20 }, { hour: 11, count: 22 },
      { hour: 12, count: 25 }, { hour: 13, count: 23 }, { hour: 14, count: 21 },
      { hour: 15, count: 19 }, { hour: 16, count: 17 }, { hour: 17, count: 20 },
      { hour: 18, count: 18 }, { hour: 19, count: 15 }, { hour: 20, count: 12 },
      { hour: 21, count: 10 }, { hour: 22, count: 8 }, { hour: 23, count: 6 }
    ],
    responseTime: { avg: 8.5, min: 2, max: 25 }
  };

  useEffect(() => {
    setAlerts(alertsData);
    setStatistics(statisticsData);
    
          // 实时预警推送
      const interval = setInterval(() => {
        if (autoRefresh) {
          // 新预警数据
          const newAlert: AlertRecord = {
            id: `ALT${Date.now()}`,
            type: ['person', 'vehicle', 'behavior', 'crowd', 'safety'][Math.floor(Math.random() * 5)] as any,
            level: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
            location: '邹城市监控区域',
            description: '检测到新的安全预警事件',
          timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          status: 'active',
                      cameraId: `CAM${Math.floor(Math.random() * 100)}`,
            cameraName: `监控点-${Math.floor(Math.random() * 100)}`,
            confidence: Math.random() * 100,
            isRead: false,
            priority: 'medium',
            estimatedTime: 30,
            coordinates: [116.970, 35.404],
            images: [getDefaultMonitorVideo()],
            tags: ['实时监控', '安全预警'],
            recommendations: ['立即派遣巡逻人员前往现场', '通知相关部门', '调取周边监控录像'],
          history: [
            { id: '1', action: '创建预警', operator: '系统', timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss') }
          ]
        };
        
        setAlerts(prev => [newAlert, ...prev]);
        setNewAlertCount(prev => prev + 1);
        
        // 声音提醒
        if (soundEnabled) {
          notification.info({
            message: '新预警',
            description: `收到新的${levelConfig[newAlert.level].text}级别预警`,
            duration: 3
          });
        }
      }
    }, 30000); // 30秒模拟一次

    return () => clearInterval(interval);
  }, [autoRefresh, soundEnabled]);

  // 获取等级颜色
  const getLevelColor = (level: string) => {
    return levelConfig[level as keyof typeof levelConfig]?.color || '#d9d9d9';
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    return typeConfig[type as keyof typeof typeConfig]?.icon || <AlertOutlined />;
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig]?.color || '#d9d9d9';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig]?.text || status;
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig]?.icon || <ClockIcon />;
  };

  // 查看详情
  const handleViewDetail = (alert: AlertRecord) => {
    setSelectedAlert(alert);
    setShowDetailDrawer(true);
    
    // 标记为已读
    if (!alert.isRead) {
      setAlerts(prev => prev.map(a => 
        a.id === alert.id ? { ...a, isRead: true } : a
      ));
    }
  };

  // 处理预警
  const handleResolve = (alert: AlertRecord) => {
    Modal.confirm({
      title: '确认处理',
      content: '确定要将此预警标记为已处理吗？',
      onOk: () => {
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, status: 'resolved' as const } : a
        ));
        message.success('预警已标记为已处理');
      }
    });
  };

  // 标记误报
  const handleFalseAlarm = (alert: AlertRecord) => {
    Modal.confirm({
      title: '确认误报',
      content: '确定要将此预警标记为误报吗？',
      onOk: () => {
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, status: 'false_alarm' as const } : a
        ));
        message.success('预警已标记为误报');
      }
    });
  };

  // 筛选
  const handleFilter = (values: any) => {
    setFilterValues(values);
    setShowFilterDrawer(false);
  };

  // 导出
  const handleExport = () => {
    message.success('预警数据导出成功');
  };

  // 批量操作
  const handleBatchOperation = (operation: string) => {
    if (selectedAlerts.length === 0) {
      message.warning('请先选择预警');
      return;
    }
    
    Modal.confirm({
      title: '批量操作',
      content: `确定要${operation}选中的${selectedAlerts.length}个预警吗？`,
      onOk: () => {
        setAlerts(prev => prev.map(a => 
          selectedAlerts.includes(a.id) 
            ? { ...a, status: operation === 'resolve' ? 'resolved' : 'false_alarm' as any }
            : a
        ));
        setSelectedAlerts([]);
        message.success(`批量${operation}成功`);
      }
    });
  };

  // 过滤后的预警
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = !searchText || 
      alert.location.toLowerCase().includes(searchText.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchText.toLowerCase()) ||
      alert.cameraName.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesLevel = !filterValues.level || alert.level === filterValues.level;
    const matchesType = !filterValues.type || alert.type === filterValues.type;
    const matchesStatus = !filterValues.status || alert.status === filterValues.status;
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'unread' && !alert.isRead) ||
      (activeTab === 'active' && alert.status === 'active') ||
      (activeTab === 'processing' && alert.status === 'processing');
    
    return matchesSearch && matchesLevel && matchesType && matchesStatus && matchesTab;
  });

  // 表格列配置
  const columns = [
    {
      title: '预警信息',
      key: 'alert',
      render: (_: any, record: AlertRecord) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: 4, 
            height: 40, 
            backgroundColor: getLevelColor(record.level),
            marginRight: 12,
            borderRadius: 2
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <Space>
                {getTypeIcon(record.type)}
                <Text strong>{record.location}</Text>
                <Tag color={getLevelColor(record.level)}>
                  {levelConfig[record.level].text}
                </Tag>
                {!record.isRead && <Badge color="red" />}
              </Space>
            </div>
            <Text type="secondary">{record.description}</Text>
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.cameraName} • {dayjs(record.timestamp).fromNow()}
              </Text>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render: (_: any, record: AlertRecord) => (
        <Badge 
          status={record.status === 'active' ? 'error' : 
                 record.status === 'processing' ? 'processing' : 
                 record.status === 'resolved' ? 'success' : 'default'} 
          text={getStatusText(record.status)}
        />
      )
    },
    {
      title: '置信度',
      key: 'confidence',
      width: 100,
      render: (_: any, record: AlertRecord) => (
        <Progress 
          percent={record.confidence} 
          size="small" 
          status={record.confidence > 90 ? 'success' : record.confidence > 70 ? 'normal' : 'exception'}
        />
      )
    },
    {
      title: '处理人',
      key: 'assignedTo',
      width: 100,
      render: (_: any, record: AlertRecord) => (
        <div>
          <div>{record.assignedTo || '-'}</div>
          {record.processingTime && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.processingTime}分钟
            </Text>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: AlertRecord) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          {record.status === 'active' && (
            <>
              <Button size="small" type="primary" onClick={() => handleResolve(record)}>
                处理
              </Button>
              <Button size="small" onClick={() => handleFalseAlarm(record)}>
                误报
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  // 预警卡片渲染
  const renderAlertCard = (alert: AlertRecord) => (
    <Card
      key={alert.id}
      style={{ 
        marginBottom: 16,
        borderLeft: `4px solid ${getLevelColor(alert.level)}`,
        cursor: 'pointer',
        opacity: alert.isRead ? 0.8 : 1
      }}
      onClick={() => handleViewDetail(alert)}
      hoverable
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <Space>
              {getTypeIcon(alert.type)}
              <Text strong style={{ fontSize: 16 }}>{alert.location}</Text>
              <Tag color={getLevelColor(alert.level)}>
                {levelConfig[alert.level].text}
              </Tag>
              {!alert.isRead && <Badge color="red" />}
            </Space>
          </div>
          <Paragraph style={{ marginBottom: 8 }}>{alert.description}</Paragraph>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space>
              <Text type="secondary">{alert.cameraName}</Text>
              <Text type="secondary">•</Text>
              <Text type="secondary">{dayjs(alert.timestamp).fromNow()}</Text>
            </Space>
            <Space>
              <Badge 
                status={alert.status === 'active' ? 'error' : 
                       alert.status === 'processing' ? 'processing' : 
                       alert.status === 'resolved' ? 'success' : 'default'} 
                text={getStatusText(alert.status)}
              />
              <Progress 
                percent={alert.confidence} 
                size="small" 
                style={{ width: 60 }}
                status={alert.confidence > 90 ? 'success' : alert.confidence > 70 ? 'normal' : 'exception'}
              />
            </Space>
          </div>
        </div>
        <div style={{ marginLeft: 16 }}>
          <Space direction="vertical">
            {alert.status === 'active' && (
              <>
                <Button size="small" type="primary" onClick={(e) => {
                  e.stopPropagation();
                  handleResolve(alert);
                }}>
                  处理
                </Button>
                <Button size="small" onClick={(e) => {
                  e.stopPropagation();
                  handleFalseAlarm(alert);
                }}>
                  误报
                </Button>
              </>
            )}
          </Space>
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            实时预警
            {newAlertCount > 0 && (
              <Badge count={newAlertCount} style={{ marginLeft: 8 }}>
                <BellOutlined style={{ fontSize: 20, color: '#1890ff' }} />
              </Badge>
            )}
          </Title>
          <Space>
            <Switch
              checkedChildren="自动刷新"
              unCheckedChildren="手动刷新"
              checked={autoRefresh}
              onChange={setAutoRefresh}
            />
            <Switch
              checkedChildren={<SoundOutlined />}
              unCheckedChildren={<AudioMutedOutlined />}
              checked={soundEnabled}
              onChange={setSoundEnabled}
            />
            <Button icon={<ReloadOutlined />} onClick={() => {
              setNewAlertCount(0);
              message.success('数据已刷新');
            }}>
              刷新
            </Button>
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="今日预警"
              value={statistics.today}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="待处理"
              value={statistics.active}
              prefix={<ClockIcon />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="已处理"
              value={statistics.resolved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="平均响应时间"
              value={statistics.responseTime.avg}
              suffix="分钟"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder="搜索预警内容..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="预警等级"
              value={filterValues.level}
              onChange={(value) => setFilterValues((prev: any) => ({ ...prev, level: value }))}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="critical">紧急</Option>
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="预警类型"
              value={filterValues.type}
              onChange={(value) => setFilterValues((prev: any) => ({ ...prev, type: value }))}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="person">人员</Option>
              <Option value="vehicle">车辆</Option>
              <Option value="behavior">行为</Option>
              <Option value="crowd">人群</Option>
              <Option value="safety">安全</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="处理状态"
              value={filterValues.status}
              onChange={(value) => setFilterValues((prev: any) => ({ ...prev, status: value }))}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="active">待处理</Option>
              <Option value="processing">处理中</Option>
              <Option value="resolved">已解决</Option>
              <Option value="false_alarm">误报</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button icon={<FilterOutlined />} onClick={() => setShowFilterDrawer(true)}>
                高级筛选
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
                             <Button 
                 icon={viewMode === 'list' ? <TableOutlined /> : <StarOutlined />}
                 onClick={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}
               >
                 {viewMode === 'list' ? '卡片' : '列表'}
               </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 标签页 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="全部预警" key="all" />
          <TabPane tab="未读预警" key="unread" />
          <TabPane tab="待处理" key="active" />
          <TabPane tab="处理中" key="processing" />
        </Tabs>

        {/* 批量操作 */}
        {selectedAlerts.length > 0 && (
          <div style={{ marginBottom: 16, padding: 12, background: '#f6ffed', borderRadius: 4 }}>
            <Space>
              <Text>已选择 {selectedAlerts.length} 个预警：</Text>
              <Button size="small" type="primary" onClick={() => handleBatchOperation('resolve')}>
                批量处理
              </Button>
              <Button size="small" onClick={() => handleBatchOperation('false_alarm')}>
                批量误报
              </Button>
              <Button size="small" onClick={() => setSelectedAlerts([])}>
                取消选择
              </Button>
            </Space>
          </div>
        )}

        {/* 预警列表 */}
        {viewMode === 'list' ? (
          <Table
            dataSource={filteredAlerts}
            columns={columns}
            rowKey="id"
            rowSelection={{
              selectedRowKeys: selectedAlerts,
              onChange: (selectedRowKeys) => setSelectedAlerts(selectedRowKeys as string[])
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }}
            loading={loading}
          />
        ) : (
          <div>
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map(renderAlertCard)
            ) : (
              <Empty description="暂无预警数据" />
            )}
          </div>
        )}
      </Card>

      {/* 详情抽屉 */}
      <Drawer
        title={
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <Space>
                {selectedAlert && getTypeIcon(selectedAlert.type)}
                <Text strong>预警详情</Text>
                {selectedAlert && (
                  <Tag color={getLevelColor(selectedAlert.level)}>
                    {levelConfig[selectedAlert.level].text}
                  </Tag>
                )}
              </Space>
            </div>
            {selectedAlert && (
              <Text type="secondary">{selectedAlert.location}</Text>
            )}
          </div>
        }
        visible={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
        width={600}
        extra={
          <Space>
            {selectedAlert?.status === 'active' && (
              <>
                <Button type="primary" onClick={() => {
                  handleResolve(selectedAlert!);
                  setShowDetailDrawer(false);
                }}>
                  处理
                </Button>
                <Button onClick={() => {
                  handleFalseAlarm(selectedAlert!);
                  setShowDetailDrawer(false);
                }}>
                  误报
                </Button>
              </>
            )}
            <Button icon={<DownloadOutlined />}>
              下载
            </Button>
          </Space>
        }
      >
        {selectedAlert && (
          <div>
            {/* 基本信息 */}
            <Descriptions title="基本信息" column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="预警类型">
                <Space>
                  {getTypeIcon(selectedAlert.type)}
                  {typeConfig[selectedAlert.type].text}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="预警等级">
                <Tag color={getLevelColor(selectedAlert.level)}>
                  {levelConfig[selectedAlert.level].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="发生时间">
                {selectedAlert.timestamp}
              </Descriptions.Item>
              <Descriptions.Item label="处理状态">
                <Badge 
                  status={selectedAlert.status === 'active' ? 'error' : 
                         selectedAlert.status === 'processing' ? 'processing' : 
                         selectedAlert.status === 'resolved' ? 'success' : 'default'} 
                  text={getStatusText(selectedAlert.status)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="摄像头">
                {selectedAlert.cameraName}
              </Descriptions.Item>
              <Descriptions.Item label="置信度">
                <Progress 
                  percent={selectedAlert.confidence} 
                  size="small" 
                  style={{ width: 100 }}
                  status={selectedAlert.confidence > 90 ? 'success' : selectedAlert.confidence > 70 ? 'normal' : 'exception'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="处理人">
                {selectedAlert.assignedTo || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="处理时间">
                {selectedAlert.processingTime ? `${selectedAlert.processingTime}分钟` : '-'}
              </Descriptions.Item>
            </Descriptions>

            {/* 预警描述 */}
            <Card title="预警描述" size="small" style={{ marginBottom: 16 }}>
              <Paragraph>{selectedAlert.description}</Paragraph>
            </Card>

            {/* 多媒体资料 */}
            {selectedAlert.images && selectedAlert.images.length > 0 && (
              <Card title="现场图片" size="small" style={{ marginBottom: 16 }}>
                <Image.PreviewGroup>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selectedAlert.images.map((img, index) => (
                      <Image
                        key={index}
                        width={120}
                        height={80}
                        src={img}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                      />
                    ))}
                  </div>
                </Image.PreviewGroup>
              </Card>
            )}

            {/* 处理建议 */}
            {selectedAlert.recommendations && selectedAlert.recommendations.length > 0 && (
              <Card title="处理建议" size="small" style={{ marginBottom: 16 }}>
                <List
                  size="small"
                  dataSource={selectedAlert.recommendations}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Text type="secondary">{index + 1}</Text>}
                        title={item}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {/* 处理历史 */}
            {selectedAlert.history && selectedAlert.history.length > 0 && (
              <Card title="处理历史" size="small" style={{ marginBottom: 16 }}>
                <AntTimeline>
                  {selectedAlert.history.map((item) => (
                    <AntTimeline.Item key={item.id}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{item.action}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                          {item.operator} • {item.timestamp}
                        </div>
                        {item.remarks && (
                          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                            备注：{item.remarks}
                          </div>
                        )}
                      </div>
                    </AntTimeline.Item>
                  ))}
                </AntTimeline>
              </Card>
            )}

            {/* 标签 */}
            {selectedAlert.tags && selectedAlert.tags.length > 0 && (
              <Card title="标签" size="small">
                <div>
                  {selectedAlert.tags.map((tag, index) => (
                    <Tag key={index} color="blue">{tag}</Tag>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </Drawer>

      {/* 高级筛选抽屉 */}
      <Drawer
        title="高级筛选"
        visible={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        width={400}
      >
        <Form form={filterForm} layout="vertical" onFinish={handleFilter}>
          <Form.Item label="时间范围" name="timeRange">
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="置信度范围" name="confidenceRange">
            <Slider
              range
              min={0}
              max={100}
              marks={{
                0: '0%',
                50: '50%',
                100: '100%'
              }}
            />
          </Form.Item>
          <Form.Item label="处理人" name="assignedTo">
            <Select placeholder="选择处理人" allowClear>
              <Option value="张警官">张警官</Option>
              <Option value="李警官">李警官</Option>
              <Option value="王警官">王警官</Option>
              <Option value="赵警官">赵警官</Option>
              <Option value="陈警官">陈警官</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                应用筛选
              </Button>
              <Button onClick={() => {
                filterForm.resetFields();
                setFilterValues({});
              }}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default RealTimeAlert; 