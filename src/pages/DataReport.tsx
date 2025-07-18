import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Tag, 
  Space, 
  Statistic,
  Progress,
  Tabs,
  Upload,
  message,
  Divider,
  Typography,
  Badge,
  Tooltip,
  Switch,
  Radio,
  Checkbox,
  List,
  Avatar,
  Timeline
} from 'antd';
import { 
  DownloadOutlined,
  FileTextOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  PrinterOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  VideoCameraOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { devices, safetyEvents, inspectionRecords } from '../data/mockData';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface ReportTemplate {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  description: string;
  lastGenerated: string;
  status: 'active' | 'inactive';
  icon: React.ReactNode;
}

const DataReport: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [form] = Form.useForm();

  // 报表模板数据
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'daily',
      name: '日报模板',
      type: 'daily',
      description: '每日设备运行状态、事件统计、性能指标汇总',
      lastGenerated: '2025-07-15 08:00:00',
      status: 'active',
      icon: <CalendarOutlined />
    },
    {
      id: 'weekly',
      name: '周报模板',
      type: 'weekly',
      description: '本周系统运行情况、趋势分析、异常事件汇总',
      lastGenerated: '2025-07-14 18:00:00',
      status: 'active',
      icon: <BarChartOutlined />
    },
    {
      id: 'monthly',
      name: '月报模板',
      type: 'monthly',
      description: '月度系统性能报告、设备维护记录、安全事件分析',
      lastGenerated: '2025-07-01 09:00:00',
      status: 'active',
      icon: <PieChartOutlined />
    },
    {
      id: 'safety',
      name: '安全事件报告',
      type: 'custom',
      description: '安全事件详细分析、处理流程、改进建议',
      lastGenerated: '2025-07-15 14:30:00',
      status: 'active',
      icon: <SafetyOutlined />
    },
    {
      id: 'device',
      name: '设备状态报告',
      type: 'custom',
      description: '设备运行状态、故障统计、维护计划',
      lastGenerated: '2025-07-15 12:00:00',
      status: 'active',
      icon: <VideoCameraOutlined />
    }
  ];

  // 统计数据
  const statistics = {
    totalReports: 156,
    thisMonth: 23,
    pendingReports: 5,
    completedReports: 151,
    avgGenerationTime: 2.3,
    successRate: 96.8
  };

  // 最近生成的报表
  const recentReports = [
    {
      id: '1',
      name: '雪亮工程日报-2025-07-15',
      type: '日报',
      size: '2.3MB',
      format: 'PDF',
      generatedBy: '系统管理员',
      generatedTime: '2025-07-15 08:00:00',
      status: 'completed'
    },
    {
      id: '2',
      name: '安全事件周报-2025年第28周',
      type: '周报',
      size: '4.1MB',
      format: 'Excel',
      generatedBy: '安全管理员',
      generatedTime: '2025-07-14 18:00:00',
      status: 'completed'
    },
    {
      id: '3',
      name: '设备状态月报-2025年7月',
      type: '月报',
      size: '8.7MB',
      format: 'Word',
      generatedBy: '设备管理员',
      generatedTime: '2025-07-01 09:00:00',
      status: 'completed'
    }
  ];

  const handleGenerateReport = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue();
      console.log('生成报表:', { template: selectedTemplate, ...values });
      message.success('报表生成成功！');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleExport = (format: string) => {
    message.success(`${format}格式报表导出成功`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    message.success('模板删除成功');
  };

  // 自定义图表组件
  const SimpleChart = ({ data, title, color = '#1890ff' }: any) => (
    <div style={{ padding: '16px 0' }}>
      <div style={{ marginBottom: 16, fontSize: 14, fontWeight: 'bold' }}>{title}</div>
      <div style={{ height: 120, position: 'relative', background: '#fafafa', borderRadius: 8 }}>
        <svg width="100%" height="100%" style={{ position: 'absolute' }}>
          {data.map((item: any, index: number) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / Math.max(...data.map((d: any) => d.value))) * 80;
            
            return (
              <g key={index}>
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill={color}
                />
                {index > 0 && (
                  <line
                    x1={`${((index - 1) / (data.length - 1)) * 100}%`}
                    y1={`${100 - (data[index - 1].value / Math.max(...data.map((d: any) => d.value))) * 80}%`}
                    x2={`${x}%`}
                    y2={`${y}%`}
                    stroke={color}
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>雪亮工程数据报表中心</Title>
        <Space>
          <Switch
            checked={autoGenerate}
            onChange={setAutoGenerate}
            checkedChildren="自动生成"
            unCheckedChildren="手动生成"
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsTemplateModalVisible(true)}
          >
            新建模板
          </Button>
        </Space>
      </div>

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总报表数"
              value={statistics.totalReports}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress percent={Math.round((statistics.thisMonth / 30) * 100)} size="small" />
            <Text type="secondary">本月已生成 {statistics.thisMonth} 份</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="完成率"
              value={statistics.successRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress percent={statistics.successRate} size="small" strokeColor="#52c41a" />
            <Text type="secondary">成功率持续提升</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均生成时间"
              value={statistics.avgGenerationTime}
              suffix="分钟"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <Progress percent={85} size="small" strokeColor="#faad14" />
            <Text type="secondary">处理效率良好</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理报表"
              value={statistics.pendingReports}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <Progress percent={Math.round((statistics.pendingReports / 10) * 100)} size="small" strokeColor="#ff4d4f" />
            <Text type="secondary">需要及时处理</Text>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><BarChartOutlined />报表概览</span>} key="overview">
            <Row gutter={16}>
              <Col span={16}>
                <Card title="报表生成趋势" size="small">
                  <SimpleChart 
                    data={[
                      { month: '1月', value: 12 },
                      { month: '2月', value: 15 },
                      { month: '3月', value: 18 },
                      { month: '4月', value: 22 },
                      { month: '5月', value: 25 },
                      { month: '6月', value: 28 },
                      { month: '7月', value: 23 }
                    ]}
                    title="月度报表生成数量"
                    color="#1890ff"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="报表类型分布" size="small">
                  <div style={{ padding: '16px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>日报</span>
                      <span>45%</span>
                    </div>
                    <Progress percent={45} size="small" strokeColor="#1890ff" />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>周报</span>
                      <span>30%</span>
                    </div>
                    <Progress percent={30} size="small" strokeColor="#52c41a" />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>月报</span>
                      <span>20%</span>
                    </div>
                    <Progress percent={20} size="small" strokeColor="#faad14" />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>专项报告</span>
                      <span>5%</span>
                    </div>
                    <Progress percent={5} size="small" strokeColor="#722ed1" />
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><FileTextOutlined />报表模板</span>} key="templates">
            <Row gutter={16}>
              {reportTemplates.map(template => (
                <Col span={8} key={template.id} style={{ marginBottom: 16 }}>
                  <Card 
                    hoverable
                    actions={[
                      <Button 
                        type="primary" 
                        size="small"
                        onClick={() => handleGenerateReport(template.id)}
                      >
                        生成报表
                      </Button>,
                      <Button 
                        size="small" 
                        icon={<EditOutlined />}
                      >
                        编辑
                      </Button>,
                      <Button 
                        size="small" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        删除
                      </Button>
                    ]}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                      <Avatar 
                        size={48} 
                        icon={template.icon}
                        style={{ backgroundColor: template.status === 'active' ? '#52c41a' : '#d9d9d9' }}
                      />
                      <div style={{ marginLeft: 12 }}>
                        <Title level={5} style={{ margin: 0 }}>{template.name}</Title>
                        <Badge 
                          status={template.status === 'active' ? 'success' : 'default'} 
                          text={template.status === 'active' ? '启用' : '停用'} 
                        />
                      </div>
                    </div>
                    <Text type="secondary">{template.description}</Text>
                    <div style={{ marginTop: 12 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        最后生成: {template.lastGenerated}
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<span><DownloadOutlined />最近报表</span>} key="recent">
            <Card title="最近生成的报表" size="small">
              <List
                dataSource={recentReports}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button size="small" icon={<EyeOutlined />}>预览</Button>,
                      <Button size="small" icon={<DownloadOutlined />}>下载</Button>,
                      <Button size="small" icon={<PrinterOutlined />}>打印</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={
                            item.format === 'PDF' ? <FilePdfOutlined /> :
                            item.format === 'Excel' ? <FileExcelOutlined /> :
                            <FileWordOutlined />
                          }
                          style={{ 
                            backgroundColor: 
                              item.format === 'PDF' ? '#ff4d4f' :
                              item.format === 'Excel' ? '#52c41a' : '#1890ff'
                          }}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{item.name}</Text>
                          <Tag color="blue">{item.type}</Tag>
                          <Tag color="green">{item.format}</Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <div>生成人: {item.generatedBy}</div>
                          <div>生成时间: {item.generatedTime}</div>
                          <div>文件大小: {item.size}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </TabPane>

          <TabPane tab={<span><TeamOutlined />报表管理</span>} key="management">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="批量操作" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button block icon={<FileExcelOutlined />}>
                      批量导出Excel
                    </Button>
                    <Button block icon={<FilePdfOutlined />}>
                      批量导出PDF
                    </Button>
                    <Button block icon={<PrinterOutlined />}>
                      批量打印
                    </Button>
                    <Button block danger icon={<DeleteOutlined />}>
                      批量删除
                    </Button>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="系统设置" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text>自动生成报表</Text>
                      <Switch 
                        checked={autoGenerate} 
                        onChange={setAutoGenerate}
                        style={{ marginLeft: 16 }}
                      />
                    </div>
                    <div>
                      <Text>邮件通知</Text>
                      <Switch defaultChecked style={{ marginLeft: 16 }} />
                    </div>
                    <div>
                      <Text>数据备份</Text>
                      <Switch defaultChecked style={{ marginLeft: 16 }} />
                    </div>
                    <div>
                      <Text>权限控制</Text>
                      <Switch defaultChecked style={{ marginLeft: 16 }} />
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 生成报表模态框 */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            生成报表
          </Space>
        }
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="reportName"
            label="报表名称"
            rules={[{ required: true, message: '请输入报表名称' }]}
          >
            <Input placeholder="请输入报表名称" />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="数据时间范围"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker 
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
            />
          </Form.Item>

          <Form.Item
            name="reportType"
            label="报表类型"
            rules={[{ required: true, message: '请选择报表类型' }]}
          >
            <Radio.Group>
              <Radio value="summary">汇总报表</Radio>
              <Radio value="detailed">详细报表</Radio>
              <Radio value="analysis">分析报表</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="exportFormat"
            label="导出格式"
            rules={[{ required: true, message: '请选择导出格式' }]}
          >
            <Checkbox.Group>
              <Checkbox value="pdf">PDF</Checkbox>
              <Checkbox value="excel">Excel</Checkbox>
              <Checkbox value="word">Word</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="includeCharts"
            label="包含内容"
          >
            <Checkbox.Group>
              <Checkbox value="statistics">统计数据</Checkbox>
              <Checkbox value="charts">图表分析</Checkbox>
              <Checkbox value="details">详细信息</Checkbox>
              <Checkbox value="recommendations">改进建议</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataReport; 