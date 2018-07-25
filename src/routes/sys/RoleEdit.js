import React, { PureComponent } from 'react';
import { Form, Input, Select, InputNumber, Modal } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalEditGone, systemRole } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const fields = { ...fieldsValue, id: systemRole.id };
      handleEdit(fields);
    });
  };
  return (
    <Modal
      title="修改角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalEditGone()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Please input some description...' }],
          initialValue: systemRole.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
        {form.getFieldDecorator('seq', {
          rules: [{ required: true, message: 'Please input some description...' }],
          initialValue: `${systemRole.seq}`,
        })(<InputNumber min={1} max={100} />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
        {form.getFieldDecorator('status', {
          rules: [{ required: true, message: 'Please input some description...' }],
          initialValue: `${systemRole.status}`,
        })(
          <Select style={{ width: 200 }}>
            <Option value="0">正常</Option>
            <Option value="1">不启用</Option>
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('description', {
          rules: [{ required: true, message: 'Please input some description...' }],
          initialValue: `${systemRole.description}`,
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
