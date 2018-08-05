/* eslint-disable react/sort-comp,prefer-template,no-param-reassign */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Popconfirm,
  message,
  Badge,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SysTable.less';
import ApkAdd from './ApkAdd';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'default', 'success', 'error'];
const status = ['正常', '未启用', '已上线', '异常'];

@connect(({ sysapk, loading }) => ({
  sysapk,
  loading: loading.models.sysapk,
}))
@Form.create()
export default class RoleList extends PureComponent {
  state = {
    modalAddVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysapk/fetch',
      payload: {},
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'sysapk/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sysapk/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'sysapk/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sysapk/fetch',
        payload: values,
      });
    });
  };

  handleModalAddVisible = flag => {
    this.setState({
      modalAddVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysapk/add',
      payload: fields,
    }).then(() => {
      // console.log(res);
      message.success('添加成功');
      this.setState({
        modalAddVisible: false,
      });
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  renderModal() {
    const { modalAddVisible } = this.state;

    if (modalAddVisible) {
      const parentAddMethods = {
        handleAdd: this.handleAdd,
        handleModalAddVisible: this.handleModalAddVisible,
      };
      return <ApkAdd {...parentAddMethods} modalVisible={modalAddVisible} />;
    }
  }

  // overLenth(text) {
  //   return text;
  // }

  render() {
    const {
      sysapk: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        render: (text, record, index) => {
          return <span>{index + 1}</span>;
        },
      },
      {
        title: '应用版本',
        dataIndex: 'hPackageversion',
      },
      {
        title: '应用包名',
        dataIndex: 'hPackagename',
      },
      {
        title: '版本号',
        dataIndex: 'hPackagecode',
      },
      {
        title: '型号',
        dataIndex: 'hVender',
      },
      // {
      //   title: '应用包位置',
      //   dataIndex: 'hPackageurl',
      //   render: (text) => {
      //     text = text.substr(text,20)+'...';
      //     return <span>{text}</span>;
      //   },
      // },
      {
        title: '文件大小',
        dataIndex: 'hSize',
        render: text => {
          const text2 = (text / (1024 * 1024)).toFixed(2) + 'M';
          return <span>{text2}</span>;
        },
      },
      {
        title: '下载链接',
        dataIndex: 'hServerurl',
        render: text => {
          text = text.substr(text, 20) + '...';
          return <span>{text}</span>;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'hCreatetime',
        render: text => {
          text = moment(text).format('YYYY-MM-DD HH:mm:ss');
          text = text.substr(text, 10) + '...';
          return <span>{text}</span>;
        },
      },
      {
        title: '状态',
        dataIndex: 'hStatus',
        filters: [
          {
            text: '正常',
            value: '0',
          },
          {
            text: '未启用',
            value: '1',
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        dataIndex: 'hId',
        render: val => (
          <Fragment>
            <Popconfirm title="是否要停用此apk？" onConfirm={() => this.handledelete(val)}>
              <a>停用</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalAddVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              rowKey="hId"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <div>{this.renderModal()}</div>
      </PageHeaderLayout>
    );
  }
}
