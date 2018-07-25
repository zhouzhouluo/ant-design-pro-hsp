import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './SysTable.less';
import RoleAdd from './RoleAdd';
import RoleEdit from './RoleEdit';
import RoleGrant from './RoleGrant';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'default', 'success', 'error'];
const status = ['正常', '未启用', '已上线', '异常'];

@connect(({ sysrole, loading }) => ({
  sysrole,
  loading: loading.models.sysrole,
}))
@Form.create()
export default class RoleList extends PureComponent {
  state = {
    modalAddVisible: false,
    modalEditVisible: false,
    modalGrantVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    selectedroleId: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysrole/fetch',
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
      type: 'sysrole/fetch',
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
      type: 'sysrole/fetch',
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
          type: 'sysrole/remove',
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
        type: 'sysrole/fetch',
        payload: values,
      });
    });
  };

  handleModalAddVisible = flag => {
    this.setState({
      modalAddVisible: !!flag,
    });
  };

  handledelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysrole/del',
      payload: id,
    });
  };

  handleModalEditVisible = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysrole/get',
      payload: id,
    }).then(() => {
      this.setState({
        modalEditVisible: true,
      });
    });
  };

  handleModalEditGone = () => {
    this.setState({
      modalEditVisible: false,
    });
  };

  handleModalGrantVisible = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysrole/getTrees',
      payload: id,
    }).then(() => {
      this.setState({
        modalGrantVisible: true,
        selectedroleId: id,
      });
    });
  };

  handleModalGrantGone = () => {
    this.setState({
      modalGrantVisible: false,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysrole/add',
      payload: fields,
    });

    message.success('添加成功');
    this.setState({
      modalAddVisible: false,
    });
  };

  handleEdit = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysrole/edit',
      payload: fields,
    });

    message.success('修改成功');
    this.setState({
      modalEditVisible: false,
    });
  };

  handleGrant = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysrole/grantRole',
      payload: fields,
    });

    message.success('授权成功');
    this.setState({
      modalGrantVisible: false,
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
    const { modalAddVisible, modalEditVisible, modalGrantVisible, selectedroleId } = this.state;

    if (modalAddVisible || modalEditVisible || modalGrantVisible) {
      if (modalAddVisible) {
        const parentAddMethods = {
          handleAdd: this.handleAdd,
          handleModalAddVisible: this.handleModalAddVisible,
        };
        return <RoleAdd {...parentAddMethods} modalVisible={modalAddVisible} />;
      } else if (modalEditVisible) {
        const {
          sysrole: { systemrole },
        } = this.props;

        const parentEditMethods = {
          handleEdit: this.handleEdit,
          handleModalEditVisible: this.handleModalEditVisible,
          handleModalEditGone: this.handleModalEditGone,
          systemRole: systemrole,
        };

        return <RoleEdit {...parentEditMethods} modalVisible={modalEditVisible} />;
      } else if (modalGrantVisible) {
        const {
          sysrole: { treedatas },
        } = this.props;
        const parentEditMethods = {
          handleGrant: this.handleGrant,
          handleModalGrantVisible: this.handleModalGrantVisible,
          handleModalGrantGone: this.handleModalGrantGone,
          treeDatas: treedatas,
          selectedRoleId: selectedroleId,
        };
        return <RoleGrant {...parentEditMethods} modalVisible={modalGrantVisible} />;
      }
    }
  }

  render() {
    const {
      sysrole: { data },
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
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '排序号',
        dataIndex: 'seq',
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '状态',
        dataIndex: 'status',
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
        dataIndex: 'id',
        render: val => (
          <Fragment>
            <a onClick={() => this.handleModalGrantVisible(val)}>授权</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleModalEditVisible(val)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.handledelete(val)}>
              <a>删除</a>
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
              rowKey="id"
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
