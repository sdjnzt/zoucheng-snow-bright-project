import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Switch,
  Button,
  Select,
  Table,
  Modal,
  message,
  Row,
  Col,
  Divider,
  Typography,
  Space,
  Badge,
  Tag,
  Progress,
  Statistic,
  Alert,
  Upload,
  DatePicker,
  TimePicker,
  Radio,
  Checkbox,
  Slider,
  InputNumber,
  TreeSelect,
  Descriptions,
  List,
  Avatar,
  Popconfirm,
  Tooltip,
  Steps,
  Result,
  Timeline,
  Drawer,
  Menu,
  Dropdown,
  notification,
  Flex,
  Segmented
} from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  SecurityScanOutlined,
  DatabaseOutlined,
  BellOutlined,
  GlobalOutlined,
  SafetyOutlined,
  ToolOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  MonitorOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  SearchOutlined,
  VideoCameraOutlined,
  CloudOutlined,
  DashboardOutlined,
  AuditOutlined,
  ApiOutlined,
  AppstoreOutlined,
  BranchesOutlined,
  BugOutlined,
  BuildOutlined,
  CalendarOutlined,
  CameraOutlined,
  CarOutlined,
  CheckOutlined,
  CloseOutlined,
  CodeOutlined,
  CompressOutlined,
  ControlOutlined,
  CrownOutlined,
  DashboardOutlined as DashboardIcon,
  DisconnectOutlined,
  DollarOutlined,
  DownloadOutlined as DownloadIcon,
  ExclamationOutlined,
  ExperimentOutlined,
  EyeInvisibleOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  FileSyncOutlined,
  FilterOutlined,
  FireOutlined,
  FlagOutlined,
  FolderOutlined,
  FrownOutlined,
  FundOutlined,
  GatewayOutlined,
  GiftOutlined,
  GlobalOutlined as GlobalIcon,
  HeartOutlined,
  HistoryOutlined,
  HomeOutlined,
  IdcardOutlined,
  ImportOutlined,
  InboxOutlined,
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  InsertRowLeftOutlined,
  InsertRowRightOutlined,
  InsuranceOutlined,
  InteractionOutlined,
  KeyOutlined as KeyIcon,
  LaptopOutlined,
  LayoutOutlined,
  LeftOutlined,
  LikeOutlined,
  LineChartOutlined,
  LinkOutlined,
  LoadingOutlined,
  LockOutlined as LockIcon,
  LoginOutlined,
  LogoutOutlined,
  MacCommandOutlined,
  MailOutlined as MailIcon,
  ManOutlined,
  MedicineBoxOutlined,
  MehOutlined,
  MenuOutlined,
  MergeCellsOutlined,
  MessageOutlined,
  MobileOutlined,
  MoneyCollectOutlined,
  MonitorOutlined as MonitorIcon,
  MoreOutlined,
  NodeIndexOutlined,
  NodeCollapseOutlined,
  NotificationOutlined,
  NumberOutlined,
  OrderedListOutlined,
  PaperClipOutlined,
  PartitionOutlined,
  PauseCircleOutlined,
  PayCircleOutlined,
  PercentageOutlined,
  PhoneOutlined as PhoneIcon,
  PictureOutlined,
  PieChartOutlined,
  PlayCircleOutlined,
  PlaySquareOutlined,
  PlusCircleOutlined,
  PlusSquareOutlined,
  PrinterOutlined,
  ProfileOutlined,
  ProjectOutlined,
  PropertySafetyOutlined,
  PullRequestOutlined,
  PushpinOutlined,
  QrcodeOutlined,
  QuestionCircleOutlined,
  QuestionOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
  ReadOutlined,
  ReconciliationOutlined,
  RedEnvelopeOutlined,
  RedoOutlined,
  ReloadOutlined,
  RestOutlined,
  RightOutlined,
  RocketOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  ScanOutlined,
  ScheduleOutlined,
  SearchOutlined as SearchIcon,
  SecurityScanOutlined as SecurityIcon,
  SendOutlined,
  SettingOutlined as SettingIcon,
  ShareAltOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SisternodeOutlined,
  SkinOutlined,
  SmileOutlined,
  SolutionOutlined,
  SoundOutlined,
  SplitCellsOutlined,
  StarOutlined,
  SubnodeOutlined,
  SwapLeftOutlined,
  SwapOutlined,
  SwapRightOutlined,
  SyncOutlined as SyncIcon,
  TableOutlined,
  TabletOutlined,
  TagOutlined,
  TagsOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ToTopOutlined,
  ToolOutlined as ToolIcon,
  TrademarkCircleOutlined,
  TrademarkOutlined,
  TransactionOutlined,
  TranslationOutlined,
  TrophyOutlined,
  UngroupOutlined,
  UnlockOutlined as UnlockIcon,
  UploadOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  UserOutlined as UserIcon,
  UserSwitchOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
  VerifiedOutlined,
  VideoCameraOutlined as VideoIcon,
  WalletOutlined,
  WarningOutlined as WarningIcon,
  WechatOutlined,
  WeiboOutlined,
  WindowsOutlined,
  WomanOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Step } = Steps;

// 雪亮工程用户数据
const users = [
  { id: 1, name: '张主任', employeeId: 'EMP1', department: '雪亮工程监控中心', position: '监控中心主任', email: 'zhang@xueliang.gov.cn', phone: '138001381', status: 'active', level: 'admin', lastLogin: '2023-10-01 10:00', avatar: '/api/placeholder/40/40', permissions: ['user_manage', 'system_config', 'data_backup', 'system_monitor'] },
  { id: 2, name: '李工程师', employeeId: 'EMP002', department: '技术部', position: '技术部经理', email: 'li@xueliang.gov.cn', phone: '138001382', status: 'active', level: 'manager', lastLogin: '2023-10-01 10:00', avatar: '/api/placeholder/40/40', permissions: ['system_config', 'system_monitor'] },
  { id: 3, name: '王技术员', employeeId: 'EMP03', department: '设备维护组', position: '设备维护工程师', email: 'wang@xueliang.gov.cn', phone: '138001383', status: 'active', level: 'user', lastLogin: '2023-10-15 14:00', avatar: '/api/placeholder/40/40', permissions: ['system_monitor'] }
];

// 用户管理组件
const UserManagement: React.FC = () => {
  const [userList, setUserList] = useState(users);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('');

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = (userId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？此操作不可恢复。',
      onOk: () => {
        setUserList(userList.filter(u => u.id !== Number(userId)));
        message.success('用户删除成功');
      }
    });
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // 编辑用户
        setUserList(userList.map(u => 
          u.id === editingUser.id ? { ...u, ...values } : u
        ));
        message.success('用户信息更新成功');
      } else {
        // 新增用户
        const newUser = {
          ...values,
          id: Date.now(),
          avatar: '/api/placeholder/40/40',
          permissions: values.permissions || []
        };
        setUserList([...userList, newUser]);
        message.success('用户创建成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredUsers = userList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.employeeId.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || user.status === statusFilter;
    const matchesLevel = !levelFilter || user.level === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  const columns = [
    {
      title: '用户信息',
      key: 'user',
      render: (_: any, record: any) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div><strong>{record.name}</strong></div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.employeeId}</div>
          </div>
        </Space>
      )
    },
    {
      title: '部门职位',
      key: 'department',
      render: (_: any, record: any) => (
        <div>
          <div>{record.department}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.position}</div>
        </div>
      )
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_: any, record: any) => (
        <div>
          <div>{record.email}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.phone}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: any) => (
        <Badge 
          status={record.status === 'active' ? 'success' : record.status === 'inactive' ? 'error' : 'warning'} 
          text={record.status === 'active' ? '活跃' : record.status === 'inactive' ? '停用' : '待激活'} 
        />
      )
    },
    {
      title: '权限级别',
      dataIndex: 'level',
      key: 'level',
      render: (_: any, record: any) => (
        <Tag color={record.level === 'admin' ? 'red' : record.level === 'manager' ? 'orange' : 'blue'}>
          {record.level === 'admin' ? '管理员' : record.level === 'manager' ? '主管' : '普通用户'}
        </Tag>
      )
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (_: any, record: any) => (
        <div>
          <div>{record.lastLogin}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {dayjs(record.lastLogin).fromNow()}
          </div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => handleEditUser(record)}>
            查看
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditUser(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDeleteUser(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Input
              placeholder="搜索用户名、工号或邮箱"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="active">活跃</Option>
              <Option value="inactive">停用</Option>
              <Option value="pending">待激活</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="权限级别"
              value={levelFilter}
              onChange={setLevelFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="admin">管理员</Option>
              <Option value="manager">主管</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
              新增用户
            </Button>
          </Col>
          <Col span={4}>
            <Button icon={<ReloadOutlined />} onClick={() => {
              setSearchText('');
              setStatusFilter('');
              setLevelFilter('');
            }}>
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 用户统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="总用户数"
              value={userList.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="活跃用户"
              value={userList.filter(u => u.status === 'active').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="管理员"
              value={userList.filter(u => u.level === 'admin').length}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="今日登录"
              value={userList.filter(u => dayjs(u.lastLogin).isSame(dayjs(), 'day')).length}
              prefix={<LoginOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 用户列表 */}
      <Card>
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />
      </Card>

      {/* 用户编辑模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="工号" name="employeeId" rules={[{ required: true, message: '请输入工号' }]}>
                <Input placeholder="请输入工号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="部门" name="department" rules={[{ required: true, message: '请选择部门' }]}>
                <Select placeholder="请选择部门">
                  <Option value="雪亮工程监控中心">雪亮工程监控中心</Option>
                  <Option value="技术部">技术部</Option>
                  <Option value="设备维护组">设备维护组</Option>
                  <Option value="安全部">安全部</Option>
                  <Option value="运维部">运维部</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="职位" name="position" rules={[{ required: true, message: '请输入职位' }]}>
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="权限级别" name="level" rules={[{ required: true, message: '请选择权限级别' }]}>
                <Select placeholder="请选择权限级别">
                  <Option value="admin">管理员</Option>
                  <Option value="manager">主管</Option>
                  <Option value="user">普通用户</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态">
                  <Option value="active">活跃</Option>
                  <Option value="inactive">停用</Option>
                  <Option value="pending">待激活</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="权限设置" name="permissions">
            <Checkbox.Group>
              <Row>
                <Col span={8}>
                  <Checkbox value="user_manage">用户管理</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="system_config">系统配置</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="data_backup">数据备份</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="system_monitor">系统监控</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="device_control">设备控制</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="alert_manage">报警管理</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 系统配置组件
const SystemConfiguration: React.FC = () => {
  const [config, setConfig] = useState({
    systemName: '雪亮工程监控系统',
    systemVersion: 'v20.1',
    dataRetentionDays: 90,
    autoBackup: true,
    backupTime: '02:00',
    alertEnabled: true,
    faceRecognitionEnabled: true,
    vehicleRecognitionEnabled: true,
    maxConcurrentUsers: 100,
    sessionTimeout: 30,
    logLevel: 'info',
    emailNotification: true,
    smsNotification: false
  });

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveConfig = () => {
    message.success('系统配置保存成功');
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="基础配置" size="small">
            <Form layout="vertical">             <Form.Item label="系统名称">
                <Input 
                  value={config.systemName}
                  onChange={(e) => handleConfigChange('systemName', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="系统版本">
                <Input 
                  value={config.systemVersion}
                  disabled
                />
              </Form.Item>
              <Form.Item label="数据保留天数">
                <InputNumber
                  value={config.dataRetentionDays}
                  onChange={(value) => handleConfigChange('dataRetentionDays', value)}
                  min={1}
                  max={365}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label="最大并发用户数">
                <InputNumber
                  value={config.maxConcurrentUsers}
                  onChange={(value) => handleConfigChange('maxConcurrentUsers', value)}
                  min={1}
                  max={1000}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label="会话超时时间（分钟）">
                <InputNumber
                  value={config.sessionTimeout}
                  onChange={(value) => handleConfigChange('sessionTimeout', value)}
                  min={5}
                  max={120}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="功能配置" size="small">
            <Form layout="vertical">             <Form.Item label="人脸识别">
                <Switch
                  checked={config.faceRecognitionEnabled}
                  onChange={(checked) => handleConfigChange('faceRecognitionEnabled', checked)}
                />
              </Form.Item>
              <Form.Item label="车牌识别">
                <Switch
                  checked={config.vehicleRecognitionEnabled}
                  onChange={(checked) => handleConfigChange('vehicleRecognitionEnabled', checked)}
                />
              </Form.Item>
              <Form.Item label="报警功能">
                <Switch
                  checked={config.alertEnabled}
                  onChange={(checked) => handleConfigChange('alertEnabled', checked)}
                />
              </Form.Item>
              <Form.Item label="邮件通知">
                <Switch
                  checked={config.emailNotification}
                  onChange={(checked) => handleConfigChange('emailNotification', checked)}
                />
              </Form.Item>
              <Form.Item label="短信通知">
                <Switch
                  checked={config.smsNotification}
                  onChange={(checked) => handleConfigChange('smsNotification', checked)}
                />
              </Form.Item>
              <Form.Item label="自动备份">
                <Switch
                  checked={config.autoBackup}
                  onChange={(checked) => handleConfigChange('autoBackup', checked)}
                />
              </Form.Item>
              <Form.Item label="备份时间">
                <TimePicker
                  value={dayjs(config.backupTime, 'HH:mm')}
                  onChange={(time) => handleConfigChange('backupTime', time?.format('HH:mm'))}
                  format="HH:mm"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label="日志级别">
                <Select
                  value={config.logLevel}
                  onChange={(value) => handleConfigChange('logLevel', value)}
                >
                  <Option value="debug">Debug</Option>
                  <Option value="info">Info</Option>
                  <Option value="warn">Warn</Option>
                  <Option value="error">Error</Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Button type="primary" onClick={handleSaveConfig}>
          保存配置
        </Button>
      </div>
    </div>
  );
};

// 数据备份组件
const DataBackup: React.FC = () => {
  const [backupList] = useState([
    { id: 1, name: '完整备份_20231015', type: 'full', size: '20.5GB', date: '2023-10-15 00:00', status: 'completed' },
    { id: 2, name: '增量备份_20231014', type: 'incremental', size: '50MB', date: '2023-10-14 00:00', status: 'completed' },
    { id: 3, name: '完整备份_20231013', type: 'full', size: '20.3GB', date: '2023-10-13 00:00', status: 'completed' }
  ]);

  const handleCreateBackup = () => {
    message.success('备份任务已启动，请稍后查看结果');
  };

  const handleRestoreBackup = (backup: any) => {
    Modal.confirm({
      title: '确认恢复',
      content: `确定要恢复备份 "${backup.name}" 吗？此操作将覆盖当前数据。`,
      onOk: () => {
        message.success('数据恢复任务已启动');
      }
    });
  };

  const handleDownloadBackup = (backup: any) => {
    message.success(`开始下载备份文件: ${backup.name}`);
  };

  const handleDeleteBackup = (backupId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个备份文件吗？',
      onOk: () => {
        message.success('备份文件删除成功');
      }
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<CloudUploadOutlined />} onClick={handleCreateBackup}>
          创建备份
        </Button>
      </div>

      <Table
        dataSource={backupList}
        columns={[
          {
            title: '备份名称',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: '备份类型',
            dataIndex: 'type',
            key: 'type',
            render: (_: any, record: any) => (
              <Tag color={record.type === 'full' ? 'blue' : 'green'}>
                {record.type === 'full' ? '完整备份' : '增量备份'}
              </Tag>
            )
          },
          {
            title: '文件大小',
            dataIndex: 'size',
            key: 'size'
          },
          {
            title: '创建时间',
            dataIndex: 'date',
            key: 'date'
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (_: any, record: any) => (
              <Badge status="success" text="完成" />
            )
          },
          {
            title: '操作',
            key: 'action',
            render: (_: any, record: any) => (
              <Space>
                <Button size="small" icon={<DownloadOutlined />} onClick={() => handleDownloadBackup(record)}>
                  下载
                </Button>
                <Button size="small" icon={<SyncOutlined />} onClick={() => handleRestoreBackup(record)}>
                  恢复
                </Button>
                <Popconfirm
                  title="确定要删除这个备份吗？"
                  onConfirm={() => handleDeleteBackup(record.id)}
                >
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            )
          }
        ]}
        rowKey="id"
      />
    </div>
  );
};

// 系统监控组件
const SystemMonitoring: React.FC = () => {
  const [systemStatus] = useState({
    cpu: 45,
    memory: 68,
    disk: 35,
    network: 25,
    uptime: '15时 32分钟',
    totalUsers: 45,
    onlineUsers: 23,
    totalDevices: 23,
    onlineDevices: 20
  });

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="CPU使用率"
              value={systemStatus.cpu}
              suffix="%"
              valueStyle={{ color: systemStatus.cpu > 80 ? '#ff4d4f' : '#1890ff' }}
            />
            <Progress percent={systemStatus.cpu} size="small" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="内存使用率"
              value={systemStatus.memory}
              suffix="%"
              valueStyle={{ color: systemStatus.memory > 80 ? '#ff4d4f' : '#1890ff' }}
            />
            <Progress percent={systemStatus.memory} size="small" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="磁盘使用率"
              value={systemStatus.disk}
              suffix="%"
              valueStyle={{ color: systemStatus.disk > 80 ? '#ff4d4f' : '#1890ff' }}
            />
            <Progress percent={systemStatus.disk} size="small" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="网络使用率"
              value={systemStatus.network}
              suffix="%"
              valueStyle={{ color: systemStatus.network > 80 ? '#ff4d4f' : '#1890ff' }}
            />
            <Progress percent={systemStatus.network} size="small" />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="系统信息" size="small">
            <Descriptions column={1} size="small">         <Descriptions.Item label="系统运行时间">{systemStatus.uptime}</Descriptions.Item>
              <Descriptions.Item label="总用户数">{systemStatus.totalUsers}人</Descriptions.Item>
              <Descriptions.Item label="在线用户数">{systemStatus.onlineUsers}人</Descriptions.Item>
              <Descriptions.Item label="总设备数">{systemStatus.totalDevices}台</Descriptions.Item>
              <Descriptions.Item label="在线设备数">{systemStatus.onlineDevices}台</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="系统状态" size="small">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>系统状态</span>
                <Badge status="success" text="正常" />
              </div>
              <Progress percent={95} size="small" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>数据库状态</span>
                <Badge status="success" text="正常" />
              </div>
              <Progress percent={98} size="small" strokeColor="#52c41a" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>网络状态</span>
                <Badge status="success" text="正常" />
              </div>
              <Progress percent={92} size="small" strokeColor="#1890ff" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// 主组件
const SystemSettings: React.FC = () => {
  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>雪亮工程系统设置</h2>
      </div>

      <Card>
        <Tabs defaultActiveKey="users">
          <TabPane tab={<span><UserOutlined />用户管理</span>} key="users">
            <UserManagement />
          </TabPane>
          <TabPane tab={<span><SettingOutlined />系统配置</span>} key="config">
            <SystemConfiguration />
          </TabPane>
          <TabPane tab={<span><DatabaseOutlined />数据备份</span>} key="backup">
            <DataBackup />
          </TabPane>
          <TabPane tab={<span><MonitorOutlined />系统监控</span>} key="monitor">
            <SystemMonitoring />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SystemSettings; 