import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button, Switch, Modal, Icon, Input, Select, Divider, Row, Col } from 'antd';
import { createInstQRCode } from './services';
import Editor from './editor';
import styles from './styles.less';
import { TableX, FormItem } from '../../../utils/ui';

class Institution extends PureComponent {
  state = {
    show: false,
    shwoPassword: false,
    creating: false,
  };
  columns = [
    {
      key: 'name',
      title: '机构名称',
      dataIndex: 'name',
    },
    {
      key: 'master',
      title: '联系人',
      dataIndex: 'master',
    },
    {
      key: 'masterPhone',
      title: '联系电话',
      dataIndex: 'masterPhone',
    },
    {
      key: 'address',
      title: '地址',
      render: (t, { address, regionName }) => {
        return (
          <div>
            {regionName}
            <br />
            {address}
          </div>
        );
      },
    },
    {
      key: 'parent',
      title: '上级机构',
      dataIndex: 'pInstitution',
      render: (t) => {
        if (t.id) {
          return <div>{t.name}</div>;
        }
        return '无';
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t, { id, username }) => {
        const change = (checked) => {
          this.props.dispatch({
            type: 'institution/changeStatus',
            payload: { id, username, status: checked ? 1 : 0 },
          });
        };
        return <Switch size="small" checked={t === 1} onChange={change} />;
      },
      align: 'center',
    },
    {
      key: 'operator',
      title: '操作',
      dataIndex: 'id',
      render: (t, r) => {
        return (
          <div>
            <Button
              onClick={this.createQR.bind(null, r.autoId, r.name)}
              disabled={this.state.creating}
              size="small"
              shape="circle"
              title="生成注册二维码"
              icon="qrcode"
            />
            <Divider type="vertical" />
            <Button
              onClick={this.update.bind(null, r)}
              size="small"
              shape="circle"
              type="primary"
              icon="edit"
            />
            <Divider type="vertical" />
            <Button
              onClick={this.remove.bind(null, t, r)}
              size="small"
              shape="circle"
              type="danger"
              icon="delete"
            />
          </div>
        );
      },
      align: 'right',
    },
  ];
  createQR = async (autoId, name) => {
    this.setState({
      creating: true,
    });
    const { data } = await createInstQRCode({
      page: 'pages/personal/bind/index',
      scene: `?iaid=${autoId}`,
      width: 1080,
    });
    if (data.length < 2000) {
      this.setState({
        creating: false,
      });
      return;
    }
    const base64 = `data:image/jpg;base64,${data}`;
    let downloadBtn = document.createElement('a');
    downloadBtn.href = base64;
    downloadBtn.setAttribute('download', `${name}的注册海报码`);
    downloadBtn.click();
    downloadBtn = null;
    this.setState({
      creating: false,
    });
  };
  update = (r) => {
    const {
      id,
      name,
      description,
      regionId,
      regionName,
      address,
      master,
      masterPhone,
      status,
      pInstitution: { id: pid, name: pName },
    } = r;

    this.showModal({
      id,
      name,
      description,
      regionId: (regionId && regionId.split(',')) || [],
      regionName,
      address,
      master,
      masterPhone,
      status,
      pid,
    });
    this.props.dispatch({
      type: 'institution/upState',
      payload: {
        parents: [
          {
            id: pid,
            name: pName,
          },
        ],
      },
    });
  };
  remove = (id, data, e) => {
    e.preventDefault();
    Modal.confirm({
      title: '是否删除机构?',
      onOk: () => {
        this.props.dispatch({
          type: 'institution/remove',
          id,
        });
      },
    });
  };
  showModal = (data) => {
    this.props.dispatch({
      type: 'institution/upState',
      payload: {
        editor: data,
      },
    });
  };
  search = () => {
    this.props.dispatch({
      type: 'institution/fetch',
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'institution/reset',
    });
  };
  // search = (value) => {
  //   this.props.dispatch({
  //     type: 'institution/searchByKeywords',
  //     payload: value,
  //   });
  // };
  // reset = () => {
  //   this.props.dispatch({
  //     type: 'institution/searchByKeywords',
  //     payload: '',
  //   });
  // };
  change = (e) => {
    this.props.dispatch({
      type: 'institution/upState',
      payload: {
        keywords: _.trim(e.target.value),
      },
    });
  };
  instChange = (value) => {
    this.props.dispatch({
      type: 'institution/upState',
      payload: {
        institutionId: value,
      },
    });
  };
  fetchInst = (value) => {
    if (!_.trim(value)) {
      return;
    }
    if (this.fetchTimer) {
      clearTimeout(this.fetchTimer);
    }
    this.fetchTimer = setTimeout(() => {
      this.props.dispatch({
        type: 'institution/fetchInst',
        payload: { name: value },
      });
    }, 300);
  };
  render() {
    return (
      <Fragment>
        <div className={styles.buttonWrap}>
          <Button onClick={this.showModal.bind(null, {})} type="primary">
            <Icon type="plus" />
            添加机构
          </Button>
          <div>
            <Button className={styles.moBtn} onClick={this.search} icon="search" type="primary">
              查询
            </Button>
            <Button className={styles.moBtn} onClick={this.reset}>
              重置
            </Button>
          </div>
        </div>
        <div className={styles.tableToolBar}>
          <Row>
            <Col span={8}>
              <FormItem className={styles.formItem} label="父机构">
                <Select
                  showSearch
                  allowClear
                  placeholder="请选择机构,并查询其子机构"
                  style={{ width: '260px' }}
                  value={this.props.institutionId}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.fetchInst}
                  onChange={this.instChange}
                >
                  {_.map(this.props.institutions, (inst, i) => (
                    <Select.Option value={inst.id} key={inst.id}>
                      {inst.name}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem} label="机构名称">
                <Input
                  style={{ width: 320 }}
                  placeholder="请输入机构名称关键字查询"
                  onChange={this.change}
                  value={this.props.keywords}
                />
              </FormItem>
            </Col>
          </Row>
        </div>
        <TableX
          columns={this.columns}
          dataSource={this.props.data || []}
          pagination={this.props.pagination}
          fetchType="institution/fetch"
          dispatch={this.props.dispatch}
        />
        <Editor editor={this.props.editor} />
      </Fragment>
    );
  }
}
function mapStateToProps({ institution }) {
  return institution;
}
export default connect(mapStateToProps)(Institution);
