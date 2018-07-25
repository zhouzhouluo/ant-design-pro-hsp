import React, { PureComponent } from 'react';
import { Form, Input, Select, InputNumber, Modal } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalAddVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalAddVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
        {form.getFieldDecorator('seq', {
          rules: [{ required: true, message: 'Please input some description...' }],
          initialValue: 1,
        })(<InputNumber min={1} max={100} />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
        {form.getFieldDecorator('status', {
          rules: [{ required: true, message: 'Please input some description...' }],
          initialValue: '0',
        })(
          <Select initialValue="0" style={{ width: 200 }}>
            <Option value="0">正常</Option>
            <Option value="1">不启用</Option>
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('description', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
export default class RoleAdd extends PureComponent {
  render() {
    return (
      <div>
        <CreateForm {...this.props} />
      </div>
    );
  }
}
