import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Progress, 
  Badge, 
  Typography, 
  Space, 
  Divider,
  Timeline,
  Alert,
  Radio,
  Select,
  Tabs,
  Button,
  Tooltip,
  Avatar,
  List,
  Drawer,
  Modal,
  Input,
  DatePicker,
  Switch,
  Flex,
  Dropdown,
  MenuProps
} from 'antd';
import { 
  VideoCameraOutlined, 
  PhoneOutlined, 
  SafetyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  WifiOutlined,
  BarsOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  SyncOutlined,
  FireOutlined,
  EyeOutlined,
  NodeIndexOutlined,
  RadarChartOutlined,
  SettingOutlined,
  BellOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
  UserOutlined,
  CloudOutlined,
  SecurityScanOutlined,
  MonitorOutlined,
  ApiOutlined,
  GlobalOutlined,
  HomeOutlined,
  RocketOutlined,
  HeartOutlined,
  MoreOutlined,
  StarOutlined,
  TeamOutlined,
  DatabaseOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CarOutlined,
  IdcardOutlined,
  CameraOutlined,
  AlertOutlined,
  ControlOutlined
} from '@ant-design/icons';
import { Pie, Line, Area, Rose, Column } from '@ant-design/plots';
import { statistics, devices, safetyEvents } from '../data/mockData';
import { faceData } from '../data/faceData';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface RealTimeData {
  cpu: number;
  memory: number;
  network: number;
  storage: number;
  timestamp: string;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Dashboard: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(false);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [showAlertDrawer, setShowAlertDrawer] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [showControlModal, setShowControlModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [filteredDevices, setFilteredDevices] = useState(devices);

  // 模拟实时数据更新
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      const newData: RealTimeData = {
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100),
        storage: Math.floor(Math.random() * 100),
        timestamp: new Date().toLocaleTimeString()
      };
      setRealTimeData(prev => [...prev.slice(-19), newData]);
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // 模拟系统警报
  useEffect(() => {
    const alerts: SystemAlert[] = [
      {
        id: '1',
        type: 'warning',
        title: '监控设备电量预警',
        message: '邹城市政府广场摄像头电池电量低于20%，建议及时更换',
        time: '14:23',
        read: false
      },
      {
        id: '2',
        type: 'error',
        title: '网络连接异常',
        message: '邹城火车站监控设备网络连接中断，正在自动重连',
        time: '14:15',
        read: false
      },
      {
        id: '3',
        type: 'success',
        title: '系统检测完成',
        message: '所有雪亮工程设备健康检查已完成，系统运行正常',
        time: '14:08',
        read: true
      },
      {
        id: '4',
        type: 'info',
        title: '人脸识别检测',
        message: `检测到${faceData[2].location}可疑人员${faceData[2].name}（${faceData[2].age}岁，${faceData[2].gender === 'male' ? '男' : '女'}），已自动报警`,
        time: '13:45',
        read: false
      }
    ];
    setSystemAlerts(alerts);
  }, []);

  // 雪亮工程核心指标数据
  const coreMetrics = [
    {
      title: '监控覆盖率',
      value: 98.5,
      unit: '%',
      icon: <CameraOutlined />,
      color: '#1890ff',
      trend: { direction: 'up', value: '+2.3%', desc: '覆盖范围扩大' },
      status: 'excellent'
    },
    {
      title: '识别准确率',
      value: 96.8,
      unit: '%',
      icon: <IdcardOutlined />,
      color: '#f759ab',
      trend: { direction: 'up', value: '+1.5%', desc: '算法持续优化' },
      status: 'good'
    },
    {
      title: '设备在线率',
      value: 94.2,
      unit: '%',
      icon: <MonitorOutlined />,
      color: '#13c2c2',
      trend: { direction: 'up', value: '+1.2%', desc: '连接稳定性提升' },
      status: 'good'
    },
    {
      title: '报警响应时间',
      value: 2.3,
      unit: '秒',
      icon: <AlertOutlined />,
      color: '#52c41a',
      trend: { direction: 'down', value: '-0.5秒', desc: '响应速度提升' },
      status: 'excellent'
    }
  ];

  // 系统健康度计算
  const systemHealth = Math.floor((statistics.onlineDevices / statistics.totalDevices) * 100);
  
  // 雪亮工程功能模块数据
  const functionalModules = [
    {
      title: '视频监控',
      count: 156,
      status: 'active',
      color: '#1890ff',
      icon: <VideoCameraOutlined />,
      description: '高清视频实时监控'
    },
    {
      title: '人脸识别',
      count: faceData.length,
      status: 'active',
      color: '#52c41a',
      icon: <IdcardOutlined />,
      description: '智能人脸识别系统'
    },
    {
      title: '车牌识别',
      count: 67,
      status: 'active',
      color: '#52c41a',
      icon: <CarOutlined />,
      description: '车牌自动识别追踪'
    },
    {
      title: '报警联动',
      count: 234,
      status: 'active',
      color: '#722ed1',
      icon: <AlertOutlined />,
      description: '智能报警联动系统'
    }
  ];

  // 实时活动数据
  const recentActivities = [
    {
      id: '1',
      type: 'success',
      title: '设备上线',
      description: '邹城市政府广场监控设备重新连接成功',
      time: '2分钟前',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    },
    {
      id: '2',
      type: 'warning',
      title: '电量预警',
      description: '邹城火车站监控设备电量低于20%',
      time: '5分钟前',
      icon: <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />
    },
    {
      id: '3',
      type: 'info',
      title: '系统巡检',
      description: '雪亮工程定时健康检查任务完成',
      time: '10分钟前',
      icon: <SyncOutlined style={{ color: '#1890ff' }} />
    },
    {
      id: '4',
      type: 'error',
      title: '连接异常',
      description: '邹城市商业街监控设备响应超时',
      time: '15分钟前',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    }
  ];

  // 系统健康度计算
  const safeSystemHealth = isNaN(systemHealth) ? 0 : systemHealth;

  // 网络流量趋势
  const networkTrendConfig = {
    data: Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      inbound: Math.floor(Math.random() * 1000 + 500),
      outbound: Math.floor(Math.random() * 800 + 300),
    })),
    xField: 'hour',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000,
      },
    },
  };

  // 设备分布柱状图 - 雪亮工程区域分布
  const deviceDistributionConfig = {
    data: [
      { zone: '政府广场', count: 28, type: '监控设备' },
      { zone: '政府广场', count: 16, type: '通信设备' },
      { zone: '政府广场', count: 14, type: '传感设备' },
      { zone: '火车站', count: 26, type: '监控设备' },
      { zone: '火车站', count: 14, type: '通信设备' },
      { zone: '火车站', count: 15, type: '传感设备' },
      { zone: '商业街', count: 24, type: '监控设备' },
      { zone: '商业街', count: 12, type: '通信设备' },
      { zone: '商业街', count: 13, type: '传感设备' },
      { zone: '公园景区', count: 18, type: '监控设备' },
      { zone: '公园景区', count: 8, type: '通信设备' },
      { zone: '公园景区', count: 9, type: '传感设备' },
    ],
    xField: 'zone',
    yField: 'count',
    seriesField: 'type',
    isGroup: true,
    color: ['#5B8FF9', '#5AD8A6', '#5D7092'],
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  // 设备搜索和筛选
  useEffect(() => {
    let filtered = devices;
    
    // 按状态筛选
    if (filterStatus !== 'all') {
      filtered = filtered.filter(device => device.status === filterStatus);
    }
    
    // 按搜索文本筛选
    if (searchText) {
      filtered = filtered.filter(device => 
        device.name.toLowerCase().includes(searchText.toLowerCase()) ||
        device.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredDevices(filtered);
  }, [searchText, filterStatus]);

  // 数据刷新函数
  const handleRefresh = () => {
    setIsLoading(true);
    // 模拟数据刷新
    setTimeout(() => {
      setIsLoading(false);
      // 可以在这里添加实际的数据刷新逻辑
      Modal.success({
        title: '刷新完成',
        content: '雪亮工程数据已更新到最新状态',
      });
    }, 1000);
  };

  // 导出数据函数
  const handleExportData = () => {
    const data = {
      devices: filteredDevices,
      metrics: coreMetrics,
      systemHealth: safeSystemHealth,
      exportTime: new Date().toLocaleString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `雪亮工程数据-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    Modal.success({
      title: '导出成功',
      content: '雪亮工程数据已成功导出到本地文件',
    });
  };

  // 系统配置函数
  const handleSystemConfig = () => {
    setShowConfigModal(true);
  };

  // 系统日志函数
  const handleSystemLog = () => {
    Modal.info({
      title: '雪亮工程系统日志',
      width: 800,
      content: (
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          <Timeline
            items={[
              {
                children: '2025-07-15 14:23:15 - 邹城市政府广场监控设备上线',
                color: 'green'
              },
              {
                children: '2025-07-15 14:20:32 - 雪亮工程系统健康检查完成',
                color: 'blue'
              },
              {
                children: '2025-07-15 14:15:45 - 邹城火车站监控设备电量预警',
                color: 'orange'
              },
              {
                children: '2025-07-15 14:10:12 - 人脸识别系统检测到可疑人员',
                color: 'red'
              },
              {
                children: '2025-07-15 14:05:33 - 雪亮工程系统启动完成',
                color: 'blue'
              }
            ]}
          />
        </div>
      ),
    });
  };

  // 设备详情函数
  const handleDeviceDetail = (device: any) => {
    setSelectedDevice(device);
    setShowDeviceModal(true);
  };

  // 设备控制函数
  const handleDeviceControl = (device: any) => {
    setSelectedDevice(device);
    setShowControlModal(true);
  };

  // 搜索函数
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // 筛选函数
  const handleFilter = (status: string) => {
    setFilterStatus(status);
  };

  // 标记警报为已读
  const markAlertAsRead = (alertId: string) => {
    setSystemAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  // 清除所有警报
  const clearAllAlerts = () => {
    setSystemAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  // 更多操作菜单处理
  const handleMoreAction = ({ key }: { key: string }) => {
    switch (key) {
      case 'export':
        handleExportData();
        break;
      case 'config':
        handleSystemConfig();
        break;
      case 'log':
        handleSystemLog();
        break;
    }
  };

  // 更多操作菜单
  const moreActions: MenuProps['items'] = [
    {
      key: 'export',
      label: '导出数据',
      icon: <DownloadOutlined />,
    },
    {
      key: 'config',
      label: '系统配置',
      icon: <SettingOutlined />,
    },
    {
      key: 'log',
      label: '系统日志',
      icon: <BarsOutlined />,
    },
  ];

  return (
      <div style={{ 
      background: '#f0f2f5',
      minHeight: '100%',
      padding: '24px'
    }}>
      {/* 顶部导航栏 */}
      <div style={{ 
        background: '#fff',
        borderRadius: '8px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
      }}>
        <Flex justify="space-between" align="center">
        <div>
            <Title level={2} style={{ 
              margin: 0, 
              color: '#262626',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              <SecurityScanOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              邹城市雪亮工程指挥中心
          </Title>
            <Text style={{ 
              fontSize: '14px', 
              color: '#8c8c8c'
            }}>
              智慧监控 · 智能识别 · 安全防护 · 一体化管理
          </Text>
        </div>
        <Space size="middle">
              <Text style={{ 
                color: '#8c8c8c',
                fontSize: '14px'
              }}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                {new Date().toLocaleString()}
              </Text>
            <Switch 
              checked={autoRefresh}
              onChange={setAutoRefresh}
              checkedChildren="自动"
              unCheckedChildren="手动"
            />
            <Badge count={systemAlerts.filter(a => !a.read).length}>
              <Button 
                  type="primary"
                icon={<BellOutlined />}
                onClick={() => setShowAlertDrawer(true)}
              >
                  通知
              </Button>
            </Badge>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                loading={isLoading}
              >
                刷新
            </Button>
              <Dropdown 
                menu={{ 
                  items: moreActions,
                  onClick: handleMoreAction
                }} 
                placement="bottomRight"
              >
                <Button 
                  icon={<MoreOutlined />}
                />
              </Dropdown>
        </Space>
        </Flex>
      </div>

      {/* 系统状态横幅 */}
      <div style={{ marginBottom: '24px' }}>
          <Alert
            message={
            <Flex justify="space-between" align="center">
                <Space size="large">
                  <Space>
                  <Text strong style={{ color: '#52c41a' }}>雪亮工程系统运行正常</Text>
                  </Space>
                  <Divider type="vertical" />
                  <Space>
                  <MonitorOutlined style={{ color: '#1890ff' }} />
                  <Text>
                    在线设备: <Text strong style={{ color: '#52c41a' }}>{statistics.onlineDevices}</Text>/{statistics.totalDevices}
                  </Text>
                  </Space>
                  <Space>
                  <TeamOutlined style={{ color: '#722ed1' }} />
                  <Text>
                    活跃用户: <Text strong style={{ color: '#722ed1' }}>{statistics.onlineUsers}</Text>
                  </Text>
                  </Space>
                  <Space>
                  <GlobalOutlined style={{ color: '#fa8c16' }} />
                  <Text>
                    网络状态: <Text strong style={{ color: '#52c41a' }}>优秀</Text>
                  </Text>
                  </Space>
                </Space>
              <Text style={{ 
                fontSize: '12px', 
                color: '#8c8c8c'
              }}>
                运行时长: 15天 3小时 45分钟
                  </Text>
            </Flex>
            }
            type="success"
            style={{ 
            borderRadius: '8px'
          }}
        />
      </div>

      {/* 核心指标卡片 - 重新设计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {coreMetrics.map((metric, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              style={{ 
                borderRadius: '12px',
                height: '160px',
                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                border: `2px solid ${metric.color}15`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              bodyStyle={{ 
                padding: '24px', 
                height: '112px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              hoverable
            >
              {/* 顶部：图标和标题 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <div style={{ 
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${metric.color}20, ${metric.color}10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <span style={{ 
                    fontSize: '20px',
                    color: metric.color
                  }}>
                    {metric.icon}
                  </span>
                  </div>
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#262626',
                    fontWeight: '600',
                    marginBottom: '2px'
                  }}>
                    {metric.title}
                    </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#8c8c8c'
                  }}>
                    {metric.trend.desc}
                    </div>
                  </div>
                </div>

              {/* 中间：数值 */}
              <div style={{ 
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: 'bold',
                  color: '#262626',
                  lineHeight: '1',
                  marginBottom: '4px'
                }}>
                    {metric.value}
                  <span style={{ 
                    fontSize: '16px', 
                    marginLeft: '4px',
                    color: '#8c8c8c',
                    fontWeight: 'normal'
                  }}>
                      {metric.unit}
                    </span>
                  </div>
                </div>

              {/* 底部：趋势信息 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                background: metric.trend.direction === 'up' ? '#f6ffed' : '#fff2f0',
                borderRadius: '8px',
                border: `1px solid ${metric.trend.direction === 'up' ? '#b7eb8f' : '#ffb3b3'}`
              }}>
                {metric.trend.direction === 'up' ? 
                  <RiseOutlined style={{ marginRight: '6px', color: '#52c41a', fontSize: '14px' }} /> : 
                  <FallOutlined style={{ marginRight: '6px', color: '#ff4d4f', fontSize: '14px' }} />
                }
                <Text style={{ 
                  color: metric.trend.direction === 'up' ? '#52c41a' : '#ff4d4f', 
                  fontSize: '13px', 
                  fontWeight: '600' 
                }}>
                  {metric.trend.value}
                </Text>
                <Text style={{ 
                  fontSize: '12px', 
                  color: '#8c8c8c',
                  marginLeft: '8px'
                }}>
                  vs 上期
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 主要监控面板 - 重新布局 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {/* 系统健康监控 */}
        <Col xs={24} lg={8}>
                     <Card 
             title={
               <Space>
                <HeartOutlined style={{ color: '#ff4757' }} />
                <span>雪亮工程健康监控</span>
                <Badge status="processing" text="实时" />
               </Space>
             }
             size="small"
             style={{ height: '400px' }}
             bodyStyle={{ padding: '16px' }}
           >
             <div style={{ marginBottom: '20px' }}>
               <div style={{ 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 marginBottom: '8px'
               }}>
                 <Text>系统整体健康度</Text>
                 <Text strong style={{ color: '#52c41a' }}>{safeSystemHealth}%</Text>
               </div>
               <Progress 
                 percent={safeSystemHealth} 
                 strokeColor={{
                   '0%': '#108ee9',
                   '100%': '#87d068',
                 }}
                 showInfo={false}
               />
             </div>

             <div style={{ marginBottom: '20px' }}>
               <div style={{ 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 marginBottom: '8px'
               }}>
                 <Text>CPU使用率</Text>
                 <Text strong style={{ color: '#1890ff' }}>45%</Text>
               </div>
               <Progress percent={45} showInfo={false} strokeColor="#1890ff" />
             </div>

             <div style={{ marginBottom: '20px' }}>
               <div style={{ 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 marginBottom: '8px'
               }}>
                 <Text>内存使用率</Text>
                 <Text strong style={{ color: '#722ed1' }}>62%</Text>
               </div>
               <Progress percent={62} showInfo={false} strokeColor="#722ed1" />
             </div>

             <div style={{ marginBottom: '20px' }}>
               <div style={{ 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 marginBottom: '8px'
               }}>
                 <Text>存储使用率</Text>
                 <Text strong style={{ color: '#fa8c16' }}>78%</Text>
               </div>
               <Progress percent={78} showInfo={false} strokeColor="#fa8c16" />
             </div>

             <div>
               <div style={{ 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 marginBottom: '8px'
               }}>
                 <Text>网络带宽</Text>
                 <Text strong style={{ color: '#13c2c2' }}>35%</Text>
               </div>
               <Progress percent={35} showInfo={false} strokeColor="#13c2c2" />
             </div>
           </Card>
         </Col>

        {/* 实时活动 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <SyncOutlined style={{ color: '#1890ff' }} />
                <span>实时活动</span>
                <Badge status="processing" text="实时" />
              </Space>
            }
            size="small"
            style={{ height: '400px' }}
            bodyStyle={{ padding: '16px' }}
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ padding: '8px 0', border: 'none' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    width: '100%'
                  }}>
                    <div style={{ 
                      marginRight: '12px',
                      marginTop: '2px'
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#262626',
                        marginBottom: '4px'
                      }}>
                        {item.title}
                      </div>
                      <div style={{ 
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginBottom: '4px'
                      }}>
                        {item.description}
                      </div>
                      <div style={{ 
                        fontSize: '11px',
                        color: '#bfbfbf'
                      }}>
                        {item.time}
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 功能模块状态 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <ControlOutlined style={{ color: '#52c41a' }} />
                <span>功能模块状态</span>
              </Space>
            }
            size="small"
            style={{ height: '400px' }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ display: 'grid', gap: '12px' }}>
              {functionalModules.map((module, index) => (
                <div key={index} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  background: '#fafafa',
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0'
                }}>
                  <div style={{ 
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: `${module.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px'
                  }}>
                    <span style={{ color: module.color, fontSize: '16px' }}>
                      {module.icon}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#262626',
                      marginBottom: '2px'
                    }}>
                      {module.title}
                    </div>
                    <div style={{ 
                      fontSize: '12px',
                      color: '#8c8c8c'
                    }}>
                      {module.description}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: module.color
                    }}>
                      {module.count}
                    </div>
                                         <Tag color="green">正常</Tag>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {/* 设备分布 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <EnvironmentOutlined style={{ color: '#1890ff' }} />
                <span>雪亮工程设备分布</span>
              </Space>
            }
            size="small"
            style={{ height: '400px' }}
          >
            <Column {...deviceDistributionConfig} height={300} />
          </Card>
        </Col>

        {/* 网络流量趋势 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <WifiOutlined style={{ color: '#52c41a' }} />
                <span>网络流量趋势</span>
              </Space>
            }
            size="small"
            style={{ height: '400px' }}
          >
            <Area {...networkTrendConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 设备管理表格 */}
      <Card 
        title={
          <Space>
            <MonitorOutlined style={{ color: '#1890ff' }} />
            <span>雪亮工程设备管理</span>
          </Space>
        }
        size="small"
        extra={
          <Space>
            <Input.Search
              placeholder="搜索设备..."
              style={{ width: 200 }}
              onSearch={handleSearch}
            />
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={handleFilter}
            >
              <Option value="all">全部状态</Option>
              <Option value="online">在线</Option>
              <Option value="offline">离线</Option>
              <Option value="warning">警告</Option>
            </Select>
          </Space>
        }
      >
        <Table
          dataSource={filteredDevices}
          columns={[
            {
              title: '设备名称',
              dataIndex: 'name',
              key: 'name',
              render: (name: string, record: any) => (
                <div>
                  <div style={{ fontWeight: 'bold' }}>{name}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {record.location}
                  </Text>
                </div>
              )
            },
            {
              title: '设备类型',
              dataIndex: 'type',
              key: 'type',
              render: (type: string) => {
                const typeConfig = {
                  camera: { color: 'blue', text: '监控摄像头', icon: <VideoCameraOutlined /> },
                  sensor: { color: 'green', text: '传感器', icon: <RadarChartOutlined /> },
                  phone: { color: 'orange', text: '对讲设备', icon: <PhoneOutlined /> },
                  controller: { color: 'purple', text: '控制设备', icon: <ControlOutlined /> }
                };
                const config = typeConfig[type as keyof typeof typeConfig];
                if (!config) {
                  return <Tag color="default">{type || '未知类型'}</Tag>;
                }
                return (
                  <Tag color={config.color} icon={config.icon}>
                    {config.text}
                  </Tag>
                );
              }
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => {
                const statusConfig = {
                  online: { color: 'green', text: '在线' },
                  offline: { color: 'red', text: '离线' },
                  warning: { color: 'orange', text: '警告' }
                };
                const config = statusConfig[status as keyof typeof statusConfig];
                if (!config) {
                  return <Tag color="default">{status || '未知状态'}</Tag>;
                }
                return <Tag color={config.color}>{config.text}</Tag>;
              }
            },
            {
              title: '最后更新',
              dataIndex: 'lastUpdate',
              key: 'lastUpdate',
              render: (time: string) => (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {time}
                </Text>
              )
            },
            {
              title: '操作',
              key: 'action',
              render: (_: any, record: any) => (
                <Space size="small">
                  <Tooltip title="查看详情">
                    <Button 
                      type="text" 
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handleDeviceDetail(record)}
                    />
                  </Tooltip>
                  <Tooltip title="设备控制">
                    <Button 
                      type="text" 
                      size="small"
                      icon={<ControlOutlined />}
                      onClick={() => handleDeviceControl(record)}
                    />
                  </Tooltip>
                </Space>
              )
            }
          ]}
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>

      {/* 警报抽屉 */}
      <Drawer
        title="系统警报"
        placement="right"
        onClose={() => setShowAlertDrawer(false)}
        open={showAlertDrawer}
        width={400}
      >
        <div style={{ marginBottom: '16px' }}>
          <Button 
            type="link" 
            onClick={clearAllAlerts}
            style={{ padding: 0 }}
          >
            全部标记为已读
          </Button>
        </div>
        <List
          dataSource={systemAlerts}
          renderItem={(alert) => (
            <List.Item style={{ 
              padding: '12px 0',
              borderBottom: '1px solid #f0f0f0',
              opacity: alert.read ? 0.6 : 1
            }}>
              <div style={{ width: '100%' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div style={{ 
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#262626'
                  }}>
                    {alert.title}
                  </div>
                  <div style={{ 
                    fontSize: '12px',
                    color: '#8c8c8c'
                  }}>
                    {alert.time}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '13px',
                  color: '#595959',
                  marginBottom: '8px'
                }}>
                  {alert.message}
                </div>
                {!alert.read && (
                  <Button 
                    type="link" 
                    size="small"
                    onClick={() => markAlertAsRead(alert.id)}
                    style={{ padding: 0, fontSize: '12px' }}
                  >
                    标记为已读
                  </Button>
                )}
              </div>
            </List.Item>
          )}
        />
      </Drawer>

      {/* 设备详情模态框 */}
      <Modal
        title="设备详情"
        open={showDeviceModal}
        onCancel={() => setShowDeviceModal(false)}
        footer={null}
        width={600}
      >
        {selectedDevice && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <div><strong>设备名称:</strong> {selectedDevice.name}</div>
                <div><strong>设备类型:</strong> {selectedDevice.type}</div>
                <div><strong>设备位置:</strong> {selectedDevice.location}</div>
                <div><strong>设备状态:</strong> {selectedDevice.status}</div>
              </Col>
              <Col span={12}>
                <div><strong>IP地址:</strong> {selectedDevice.ip}</div>
                <div><strong>MAC地址:</strong> {selectedDevice.mac}</div>
                <div><strong>固件版本:</strong> {selectedDevice.firmware}</div>
                <div><strong>最后更新:</strong> {selectedDevice.lastUpdate}</div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* 设备控制模态框 */}
      <Modal
        title="设备控制"
        open={showControlModal}
        onCancel={() => setShowControlModal(false)}
        footer={null}
        width={600}
      >
        {selectedDevice && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <strong>设备:</strong> {selectedDevice.name}
            </div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" block>
                重启设备
              </Button>
              <Button block>
                设备诊断
              </Button>
              <Button block>
                固件升级
              </Button>
              <Button block>
                配置备份
              </Button>
            </Space>
          </div>
        )}
      </Modal>

      {/* 系统配置模态框 */}
      <Modal
        title="系统配置"
        open={showConfigModal}
        onCancel={() => setShowConfigModal(false)}
        footer={null}
        width={800}
      >
        <Tabs defaultActiveKey="general">
          <TabPane tab="常规设置" key="general">
            <div>常规配置选项</div>
          </TabPane>
          <TabPane tab="网络设置" key="network">
            <div>网络配置选项</div>
          </TabPane>
          <TabPane tab="安全设置" key="security">
            <div>安全配置选项</div>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default Dashboard; 