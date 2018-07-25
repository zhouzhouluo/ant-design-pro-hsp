/* eslint-disable no-unused-vars,prefer-destructuring,import/newline-after-import,spaced-comment,no-shadow,object-shorthand */
import React, { PureComponent } from 'react';
import { Form, Input, Select, Modal, Upload, Button, Icon, message } from 'antd';
import reqwest from 'reqwest';
import fetch from 'dva/fetch';
const Dragger = Upload.Dragger;

const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalAddVisible,
    uploading,
    fileList,
    props2,
    handleUpload,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      // handleUpload(fieldsValue);
      // console.info("fieldsValue=:"+JSON.stringify(fieldsValue));
      const formData = new FormData();
      // fileList.forEach((file) => {
      //   formData.append('file', file);
      // });
      const file = fileList[0];
      formData.append('file', file);
      formData.append('vender', fieldsValue.vender);
      formData.append('model', fieldsValue.model);
      handleAdd(formData);
    });
  };

  return (
    <Modal
      title="发布APK"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalAddVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="请选择厂家">
        {form.getFieldDecorator('vender', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="请选择型号">
        {form.getFieldDecorator('model', {
          rules: [{ required: true, message: 'Please input some description...' }],
          initialValue: '0',
        })(
          <Select initialValue="0" style={{ width: 200 }}>
            <Option value="0">正常</Option>
            <Option value="1">不启用</Option>
          </Select>
        )}
      </FormItem>
      <div>
        <Upload {...props2}>
          <Button>
            <Icon type="upload" /> Select File
          </Button>
        </Upload>
        {/*<Button*/}
        {/*className="upload-demo-start"*/}
        {/*type="primary"*/}
        {/*onClick={this.handleUpload}*/}
        {/*disabled={fileList.length === 0}*/}
        {/*loading={uploading}*/}
        {/*>*/}
        {/*{uploading ? 'Uploading' : 'Start Upload'}*/}
        {/*</Button>*/}
      </div>
    </Modal>
  );
});

@Form.create()
export default class RoleAdd extends PureComponent {
  state = {
    fileList: [],
    uploading: false,
  };

  handleUpload = fieldsValue => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });

    // You can use any AJAX library you like
    reqwest({
      url: 'http://127.0.0.1:6217/api/sys/apk/add.action',
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        message.success('upload successfully.');
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('upload failed.');
      },
    });
  };

  render() {
    const { uploading, fileList } = this.state;

    const props2 = {
      multiple: false,
      action: '//jsonplaceholder.typicode.com/posts/',
      onRemove: file => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: fileList,
    };

    return (
      <div>
        <CreateForm
          {...this.props}
          uploading={uploading}
          fileList={fileList}
          props2={props2}
          handleUpload={this.handleUpload}
        />
      </div>
    );
  }
}
