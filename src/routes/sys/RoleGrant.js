/* eslint-disable prefer-destructuring */
import React, { PureComponent } from 'react';
import { Form, Modal, Tree } from 'antd';

const TreeNode = Tree.TreeNode;

@Form.create()
export default class RoleGrant extends PureComponent {
  state = {
    // expandedKeys: ['0-0-0', '0-0-1'],
    // autoExpandParent: true,
    checkedKeys: [],
    // selectedKeys: [],
  };

  componentDidMount() {
    const { treeDatas } = this.props;
    this.setState({
      checkedKeys: treeDatas.resourceIdList,
    });
  }

  onExpand = keys => {
    console.log('onExpand', keys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      // expandedKeys:keys,
      // autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    // this.setState({ selectedKeys });
  };

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.text} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.text} key={item.id} />;
    });
  };

  render() {
    const {
      modalVisible,
      handleGrant,
      handleModalGrantGone,
      treeDatas,
      selectedRoleId,
    } = this.props;

    const { checkedKeys } = this.state;

    const okHandle = () => {
      const parm = {
        roleId: selectedRoleId,
        resourceIds: checkedKeys,
      };
      handleGrant(parm);
    };

    return (
      <div>
        <Modal
          title="角色授权"
          visible={modalVisible}
          onOk={okHandle}
          onCancel={() => handleModalGrantGone()}
        >
          <Tree
            checkable
            onExpand={this.onExpand}
            defaultExpandAll
            onCheck={this.onCheck}
            checkedKeys={checkedKeys}
            onSelect={this.onSelect}
            // selectedKeys={selectedKeys}
          >
            {this.renderTreeNodes(treeDatas.treeList)}
          </Tree>
        </Modal>
      </div>
    );
  }
}
