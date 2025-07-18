import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Select, 
  DatePicker, 
  Button, 
  Statistic, 
  Tag, 
  Progress, 
  Table,
  Input,
  Space,
  Tabs,
  Timeline,
  Alert,
  Badge,
  Tooltip,
  Switch,
  Radio,
  Divider,
  message,
  Modal,
  Form,
  InputNumber,
  Dropdown,
  Menu
} from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined,
  RiseOutlined,
  FallOutlined,
  SyncOutlined,
  ExportOutlined,
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  EyeOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  EnvironmentOutlined,
  BellOutlined,
  DownloadOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DashboardOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  UserOutlined,
  CarOutlined,
  VideoCameraOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { chartData, dataRecords, devices } from '../data/mockData';
import { faceData } from '../data/faceData';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

interface DataPoint {
  time: string;
  faceDetections: number;
  vehicleCount: number;
  alertCount: number;
  cameraStatus: string;
  location: string;
}

interface AnalysisMetrics {
  totalDetections: number;
  avgFaceDetections: number;
  avgVehicleCount: number;
  avgAlertCount: number;
  dataGrowth: number;
  anomalyCount: number;
  qualityScore: number;
  realtimeConnections: number;
  faceRecognitionRate: number;
  vehicleRecognitionRate: number;
  alertResponseTime: number;
  systemUptime: number;
}

const DataAnalysis: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('faceDetections');
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [filterType, setFilterType] = useState('all');
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  
  const [metrics, setMetrics] = useState<AnalysisMetrics>({
    totalDetections: 0,
    avgFaceDetections: 0,
    avgVehicleCount: 0,
    avgAlertCount: 0,
    dataGrowth: 0,
    anomalyCount: 0,
    qualityScore: 0,
    realtimeConnections: 0,
    faceRecognitionRate: 0,
    vehicleRecognitionRate: 0,
    alertResponseTime: 0,
    systemUptime: 0
  });

  const [realtimeData, setRealtimeData] = useState<DataPoint[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  // 模拟实时数据更新
  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics = {
        totalDetections: 12500 + Math.floor(Math.random() * 100),
        avgFaceDetections: 156 + Math.random() * 20 - 10,
        avgVehicleCount: 89 + Math.random() * 15 - 7.5,
        avgAlertCount: 12 + Math.random() * 5 - 2.5,
        dataGrowth: 150.8 + Math.random() * 3 - 1.5,
        anomalyCount: Math.floor(Math.random() * 8),
        qualityScore: 96 + Math.random() * 3,
        realtimeConnections: devices.filter(d => d.status === 'online').length,
        faceRecognitionRate: (faceData.filter(f => f.confidence > 80).length / faceData.length * 100) + Math.random() * 5 - 2.5,
        vehicleRecognitionRate: 90.0 + Math.random() * 4 - 2,
        alertResponseTime: 20.3 + Math.random() * 1 - 0.5,
        systemUptime: 90.0 + Math.random() * 0.2 - 0.1
      };
      setMetrics(newMetrics);

      // 生成趋势数据
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const newTrendData = hours.map(hour => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        faceDetections: Math.floor(150 + Math.sin(hour * Math.PI / 12) * 30 + Math.random() * 20),
        vehicleCount: Math.floor(80 + Math.cos(hour * Math.PI / 12) * 20 + Math.random() * 15),
        alertCount: Math.floor(10 + Math.sin(hour * Math.PI / 6) * 5 + Math.random() * 3),
        cameraStatus: Math.floor(95 + Math.random() * 3 - 1.5)
      }));
      setTrendData(newTrendData);

      // 生成实时数据流
      const newRealtimeData = Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - i * 30000).toLocaleTimeString(),
        faceDetections: Math.floor(150 + Math.random() * 50),
        vehicleCount: Math.floor(80 + Math.random() * 30),
        alertCount: Math.floor(10 + Math.random() * 8),
        cameraStatus: Math.random() > 0.05 ? 'normal' : 'anomaly',
        location: ['邹城市政府广场, 邹城火车站', '邹城市商业步行街', '市人民公园', '邹城市建设银行', '邹城市文化广场'][Math.floor(Math.random() * 5)]
      }));
      setRealtimeData(newRealtimeData);
    };

    updateMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(updateMetrics, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // 自定义图表组件 - 使用Progress条形图
  const BarChart = ({ data, title, color = '#1890ff' }: any) => (
    <div style={{ padding: '16px 0' }}>
      <div style={{ marginBottom: 16, fontSize: 14, fontWeight: 'bold' }}>{title}</div>
      {data.map((item: any, index: number) => (
        <div key={index} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12 }}>{item.name}</span>
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>{item.value}</span>
          </div>
          <Progress 
            percent={Math.min((item.value / Math.max(...data.map((d: any) => d.value))) * 100, 100)} 
            size="small"
            strokeColor={color}
            showInfo={false}
          />
        </div>
      ))}
    </div>
  );

  // 自定义趋势图组件
  const TrendChart = ({ data, field, color = '#1890ff' }: any) => {
    const minValue = Math.min(...data.map((d: any) => d[field]));
    const maxValue = Math.max(...data.map((d: any) => d[field]));
    const range = maxValue - minValue;
    
    return (
      <div style={{ padding: '16px 0' }}>
        <div style={{ height: 240, position: 'relative', background: '#fff', borderRadius: 8, padding: '20px' }}>
          {/* Y轴标签 */}
          <div style={{ position: 'absolute', left: 0, top: 20, bottom: 20, width: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {[0, 25, 50, 75, 100].map((percent, index) => {
              const value = minValue + (range * percent / 100);
              return (
                <div key={index} style={{ fontSize: 10, color: '#666', textAlign: 'right' }}>
                  {Math.floor(value)}
                </div>
              );
            })}
          </div>
          
          {/* X轴标签 */}
          <div style={{ position: 'absolute', left: 40, right: 0, bottom: 0, height: 20, display: 'flex', justifyContent: 'space-between' }}>
            {data.filter((_: any, index: number) => index % 4 === 0).map((item: any, index: number) => (
              <div key={index} style={{ fontSize: 10, color: '#666', textAlign: 'center' }}>
                {item.hour}
              </div>
            ))}
          </div>
          
          {/* 图表区域 */}
          <div style={{ position: 'absolute', left: 40, top: 20, right: 0, bottom: 20 }}>
            <svg width="100%" height="100%" style={{ position: 'absolute' }}>
              {/* 网格线 */}
              {[0, 25, 50, 75, 100].map((percent, index) => {
                const y = (100 - percent) * 0.8 + 10;
                return (
                  <line
                    key={index}
                    x1="0"
                    y1={`${y}%`}
                    x2="100%"
                    y2={`${y}%`}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                );
              })}
              
              {/* 数据线 */}
              {data.map((item: any, index: number) => {
                if (index === 0) return null;
                const prevItem = data[index - 1];
                const x1 = ((index - 1) / (data.length - 1)) * 100;
                const x2 = (index / (data.length - 1)) * 100;
                const y1 = 100 - ((prevItem[field] - minValue) / range) * 80 - 10;
                const y2 = 100 - ((item[field] - minValue) / range) * 80 - 10;
                
                return (
                  <line
                    key={index}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke={color}
                    strokeWidth="2"
                  />
                );
              })}
              
              {/* 数据点 */}
              {data.map((item: any, index: number) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - ((item[field] - minValue) / range) * 80 - 10;
                
                return (
                  <g key={index}>
                    <circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="3"
                      fill={color}
                    />
                    {/* 数值标签 */}
                    {index % 3 === 0 && (
                      <text
                        x={`${x}%`}
                        y={`${y - 8}%`}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#666"
                      >
                        {Math.floor(item[field])}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    );
  };

  // 导出数据
  const handleExport = (format: string) => {
    message.success(`${format}格式数据导出成功`);
    setIsExportModalVisible(false);
  };

  // 生成分析报告
  const generateReport = () => {
    message.success('分析报告生成成功，已发送到邮箱');
  };

  // 数据质量分析
  const qualityMetrics = [
    { name: '数据完整性', value: 98.5, status: 'good' },
    { name: '数据准确性', value: 96.2, status: 'good' },
    { name: '数据及时性', value: 99.1, status: 'excellent' },
    { name: '数据一致性', value: 94.8, status: 'good' },
    { name: '异常检测', value: 1.3, status: 'warning' }
  ];

  // 异常检测数据
  const anomalyData = [
    { time: '14:30:15', type: 'temperature', value: 45.2, threshold: 40, severity: 'high' },
    { time: '14:25:10', type: 'humidity', value: 95.8, threshold: 90, severity: 'medium' },
    { time: '14:20:05', type: 'voltage', value: 195.3, threshold: 200, severity: 'low' }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>雪亮工程数据分析中心</h2>
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
          <Button 
            type="primary" 
            icon={<ExportOutlined />}
            onClick={() => setIsExportModalVisible(true)}
          >
            导出数据
          </Button>
        </Space>
      </div>

      {/* 关键指标概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="今日检测总数"
              value={metrics.totalDetections}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}            suffix="次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="人脸识别率"
              value={metrics.faceRecognitionRate}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}            suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="车牌识别率"
              value={metrics.vehicleRecognitionRate}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#faad14' }}            suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="系统可用性"
              value={metrics.systemUptime}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#722ed1' }}            suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 详细统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="平均人脸检测"
              value={metrics.avgFaceDetections}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}            suffix="次/小时"
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="平均车辆检测"
              value={metrics.avgVehicleCount}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#faad14' }}            suffix="辆/小时"
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="平均报警次数"
              value={metrics.avgAlertCount}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#ff4d4f' }}            suffix="次/小时"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="报警响应时间"
              value={metrics.alertResponseTime}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#722ed1' }}            suffix="分钟"         precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 主分析面板 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><DashboardOutlined />数据概览</span>} key="overview">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="24小时趋势分析" size="small">
                  <Select 
                    value={selectedMetric} 
                    onChange={setSelectedMetric}
                    style={{ width: 200, marginBottom: 16 }}
                  >
                    <Option value="faceDetections">人脸检测</Option>
                    <Option value="vehicleCount">车辆检测</Option>
                    <Option value="alertCount">报警次数</Option>
                    <Option value="cameraStatus">摄像头状态</Option>
                  </Select>
                  <TrendChart 
                    data={trendData} 
                    field={selectedMetric}
                    color={selectedMetric === 'faceDetections' ? '#1890ff' : 
                           selectedMetric === 'vehicleCount' ? '#faad14' :
                           selectedMetric === 'alertCount' ? '#ff4d4f' : '#52c41a'}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="实时数据流" size="small">
                  <div style={{ height: 300, overflowY: 'auto' }}>
                    <Timeline>
                      {realtimeData.slice(0, 10).map((item, index) => (
                        <Timeline.Item 
                          key={index}
                          color={item.cameraStatus === 'normal' ? 'green' : 'red'}
                        >
                          <div style={{ fontSize: 12 }}>
                            <div><strong>{item.time}</strong> - {item.location}</div>
                            <div>人脸检测: {item.faceDetections} | 车辆: {item.vehicleCount} | 报警: {item.alertCount}</div>
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><BarChartOutlined />区域分析</span>} key="regional">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="各区域检测统计" size="small">
                  <BarChart 
                    data={[
                      { name: '邹城市政府广场', value: 2456 },
                      { name: '邹城市火车站', value: 1892 },
                      { name: '邹城市商业步行街', value: 1678 },
                      { name: '邹城市人民公园', value: 1345 },
                      { name: '邹城市建设银行', value: 987 },
                      { name: '邹城市文化广场', value: 756 }
                    ]}
                    title="人脸检测分布"
                    color="#1890ff"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="各区域车辆统计" size="small">
                  <BarChart 
                    data={[
                      { name: '邹城市高速入口', value: 1234 },
                      { name: '邹城市主干道', value: 987 },
                      { name: '邹城市政府广场', value: 654 },
                      { name: '邹城市商业区', value: 543 },
                      { name: '邹城市火车站', value: 432 },
                      { name: '邹城市公园周边', value: 321 }
                    ]}
                    title="车辆检测分布"
                    color="#faad14"
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><LineChartOutlined />趋势分析</span>} key="trends">
            <Row gutter={16}>
              <Col span={24}>
                <Card title="7天趋势对比" size="small">
                  <Row gutter={16}>
                    <Col span={6}>
                      <Statistic
                        title="数据增长率"
                        value={metrics.dataGrowth}
                        prefix={<RiseOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                        suffix="%"
                        precision={1}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="异常检测"
                        value={metrics.anomalyCount}
                        prefix={<WarningOutlined />}
                        valueStyle={{ color: '#faad14' }}
                        suffix="次"
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="数据质量"
                        value={metrics.qualityScore}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                        suffix="%"
                        precision={1}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="在线设备"
                        value={metrics.realtimeConnections}
                        prefix={<VideoCameraOutlined />}
                        valueStyle={{ color: '#722ed1' }}
                        suffix="台"
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><FileTextOutlined />报告生成</span>} key="reports">
            <Row gutter={16}>
              <Col span={24}>
                <Card title="分析报告" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Alert
                      message="数据质量良好"
                      description="所有监控设备运行正常，数据采集质量达到预期标准"
                      type="success"
                      showIcon
                    />
                    <Alert
                      message="识别率提升"
                      description="人脸识别率较上周提升2.3%"
                      type="info"
                      showIcon
                    />
                    <Button 
                      type="primary" 
                      icon={<FileTextOutlined />}
                      onClick={generateReport}
                    >
                      生成详细报告
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 导出数据模态框 */}
      <Modal
        title="导出数据"
        visible={isExportModalVisible}
        onCancel={() => setIsExportModalVisible(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button 
            block 
            icon={<DownloadOutlined />}
            onClick={() => handleExport('Excel')}
          >
            导出为Excel
          </Button>
          <Button 
            block 
            icon={<FileTextOutlined />}
            onClick={() => handleExport('PDF')}
          >
            导出为PDF
          </Button>
          <Button 
            block 
            icon={<DownloadOutlined />}
            onClick={() => handleExport('CSV')}
          >
            导出为CSV
          </Button>
        </Space>
      </Modal>
    </div>
  );
};

export default DataAnalysis; 