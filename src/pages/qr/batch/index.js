import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button, Modal, Icon, Input, Divider, InputNumber, message, Popconfirm } from 'antd';
import Editor from './editor';
import { jump } from '../../../utils';
import { TableX } from "../../../utils/ui";
import styles from '../index.less';
import { getApiPreFix } from '../../../utils/request';

class QrBatch extends PureComponent {
  state = {
    plus: '',
    plusNumber: 1,
    downloadRange: [],
    download: '',
    checkRange: [],
    check: '',
  };
  columns = [
    {
      key: 'name',
      title: '批次名称',
      dataIndex: 'name',
      render: (t, r) => {
        if (r.status !== 0) {
          return <a onClick={this.qrList.bind(null, r.id)}>{t}</a>;
        }
        return t;
      },
    },
    {
      key: 'type',
      title: '码类型',
      dataIndex: 'qrType',
      render: (t) => t.name,
    },
    {
      key: 'total',
      title: '数量',
      dataIndex: 'total',
      render: (t, r) => {
        const { userType } = this.props.user;
        // 机构管理员不能追加码
        if (r.status < 2 || userType === 3) {
          return t;
        }
        return (
          <div>
            {t}{' '}
            <Button
              onClick={this.showPlus.bind(null, r)}
              title="追加"
              size="small"
              shape="circle"
              icon="plus"
              type="ghost"
            />
          </div>
        );
      },
    },
    {
      key: 'linked',
      title: '关联实体',
      render: (t, r) => {
        const res = [];
        if (r.institutionId && r.institution) {
          res.push({ label: '机构', name: r.institution.name });
        }
        if (r.productId && r.product) {
          res.push({ label: '商品', name: r.product.title });
        }
        if (r.activityId && r.activity) {
          res.push({ label: '活动', name: r.activity.name });
        }
        if (res.length > 0) {
          return _.map(res, (item, i) => (
            <div key={`${item.label}_${r.id}`}>
              [{item.label}] {item.name}
            </div>
          ));
        }
        return '未关联实体';
      },
    },
    {
      key: 'status',
      title: '制码状态',
      dataIndex: 'status',
      render: (t) => {
        switch (t) {
          case 0: {
            return '未制作';
          }
          case 1: {
            return '制作中...';
          }
          default: {
            return '空闲';
          }
        }
      },
      align: 'center',
    },
    {
      key: 'checkQRStatus',
      title: '制码状态',
      dataIndex: 'checkQRStatus',
      render: (t, r) => {
        let text = '';
        switch (t) {
          case 0: {
            text = '未校验';
            break;
          }
          case 1: {
            text = '正在校验...';
            break;
          }
          case 2: {
            text = '有异常, 重新校验';
            break;
          }
          case 3: {
            text = '图片集完整';
            break;
          }
          default: {
            text = '未知状态';
          }
        }
        if (true) {
          const checkStatus = () => {
            this.showCheckImages(r);
          };
          return (
            <div>
              {text}{' '}
              <Button
                shape="circle"
                type="danger"
                onClick={checkStatus}
                icon="file-protect"
                size="small"
                title="校验图片文件完整性"
              />
            </div>
          );
        } else {
          return text;
        }
      },
      align: 'center',
    },
    {
      key: 'zipStatus',
      title: '压缩包',
      dataIndex: 'zipStatus',
      render: (t, r) => {
        switch (t) {
          case 0: {
            return '没有压缩包';
          }
          case 1: {
            return '压缩中...';
          }
          case 2: {
            return '压缩失败, 再来一次';
          }
          default: {
            return (
              <a href={`${getApiPreFix()}wxaCodeDir/${r.autoId}/${r.autoId}.zip`}>下载压缩包</a>
            );
          }
        }
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
              onClick={this.update.bind(null, r)}
              size="small"
              shape="circle"
              type="primary"
              icon="edit"
              title="编辑"
            />
            {r.status !== 1
              ? [
                  <Divider key="generator_line" type="vertical" />,
                  <Button
                    key="generator_btn"
                    onClick={this.generator.bind(null, t, r.total)}
                    size="small"
                    shape="circle"
                    type="default"
                    icon="qrcode"
                    title="生成二维码数据"
                  />,
                ]
              : null}
            {r.status === 0
              ? [
                  <Divider type="vertical" key="delete_line" />,
                  <Popconfirm
                    key="delete_btn"
                    okText="删除"
                    okType="danger"
                    icon={<Icon type="delete" />}
                    title="是否删除批次数据?"
                    onConfirm={this.remove.bind(null, t)}
                  >
                    <Button size="small" shape="circle" type="danger" icon="delete" />
                  </Popconfirm>,
                ]
              : null}
            {r.status > 1 && r.imgCount > 0
              ? [
                  <Divider type="vertical" key="download_line" />,
                  <Button
                    key="download_btn"
                    size="small"
                    type="default"
                    icon="file-zip"
                    shape="circle"
                    disabled={r.zipStatus === 1}
                    type="danger"
                    title="生成压缩包"
                    onClick={this.showDownload.bind(null, r)}
                  />,
                ]
              : null}
          </div>
        );
      },
      align: 'right',
    },
  ];
  showModal = (payload) => {
    this.props.dispatch({
      type: 'qrBatch/initEditor',
      payload,
    });
  };
  search = (value) => {
    this.props.dispatch({
      type: 'qrBatch/searchByKeywords',
      payload: value,
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'qrBatch/searchByKeywords',
      payload: '',
    });
  };
  change = (e) => {
    this.props.dispatch({
      type: 'qrBatch/upState',
      payload: {
        keywords: _.trim(e.target.value),
      },
    });
  };
  qrList = (id) => {
    console.log(id);
    jump(`/qr/list/${id}`);
  };
  update = (r) => {
    this.showModal(r);
  };
  remove = (t) => {
    message.error('调删除接口', 3);
  };
  showPlus = ({ id }) => {
    this.setState({
      plus: id,
    });
  };
  hidePlus = () => {
    this.setState({
      plus: '',
      plusNumber: 1,
    });
  };
  plus = () => {
    const { plusNumber, plus } = this.state;
    const target = _.find(this.props.data, ['id', plus]);
    if (target) {
      const { imgCount } = target;
      this.props.dispatch({
        type: 'qrBatch/generate',
        payload: { id: plus, from: imgCount, total: plusNumber },
      });
    }
    this.hidePlus();
  };
  generator = (id, total) => {
    // message.success('调预生成二维码的接口, 改编该批次的生成状态', 10);
    this.props.dispatch({
      type: 'qrBatch/generate',
      payload: { id, from: 0, total },
    });
  };
  showDownload = (data) => {
    this.setState({
      download: data.id,
      downloadRange: [1, data.total],
    });
  };
  hideDownload = () => {
    this.setState({
      download: '',
      downloadRange: '',
    });
  };
  download = () => {
    const { download, downloadRange } = this.state;
    const target = _.find(this.props.data, ['id', download]);
    const [from, to] = downloadRange;
    if (target) {
      this.props.dispatch({
        type: 'qrBatch/download',
        payload: { id: download, from, to },
      });
    }
    this.hideDownload();
  };
  showCheckImages = (data) => {
    this.setState({
      check: data.id,
      checkRange: [1, data.total],
    });
  };
  hideCheckImages = () => {
    this.setState({
      check: '',
      checkRange: '',
    });
  };
  checkImages = () => {
    const { check, checkRange } = this.state;
    const target = _.find(this.props.data, ['id', check]);
    const [from, to] = checkRange;
    if (target) {
      this.props.dispatch({
        type: 'qrBatch/check',
        payload: { id: check, from, to },
      });
    }
    this.hideCheckImages();
  };
  showCheckImages = (data) => {
    this.setState({
      check: data.id,
      checkRange: [1, data.total],
    });
  };
  render() {
    const initNewItem = {
      name: '',
      description: '',
      status: 1,
    };
    // 在这里判断用户身份, 决定显示什么表头
    if(this.props.user.userType === 3) {
      this.columns.splice(4, 4)
    }
    return (
      <Fragment>
        <div className={styles.tableToolBar}>
          <Button onClick={this.showModal.bind(null, initNewItem)} type="primary">
            <Icon type="plus" />
            添加批次
          </Button>
          <div className={styles.tableToolBar}>
            <Input.Search
              style={{ width: 320 }}
              onSearch={this.search}
              placeholder="请输入码类型名称关键字查询"
              onChange={this.change}
              value={this.props.keywords}
            />
            <Button onClick={this.reset}>重置</Button>
          </div>
        </div>
        <TableX
          columns={this.columns}
          dataSource={this.props.data || []}
          pagination={this.props.pagination}
          fetchType="qrBatch/fetch"
          dispatch={this.props.dispatch}
        />
        {/* <Table
          rowKey="id"
          columns={this.columns}
          dataSource={this.props.data || []}
          locale={{ emptyText: '暂无数据' }}
          pagination={{
            pageSize: this.props.pagination.pageSize,
            total: this.props.pagination.total,
            current: this.props.pagination.page,
            onChange: (page, pageSize) => {
              this.props.dispatch({
                type: 'qrBatch/fetch',
                payload: { page, pageSize },
              });
            },
          }}
        /> */}
        <Editor editor={this.props.editor} />
        <Modal
          visible={!!this.state.plus}
          onCancel={this.hidePlus}
          onOk={this.plus}
          title="追加批次码数量"
        >
          <div>
            <div>请输入追加数量</div>
            <InputNumber
              value={this.state.plusNumber}
              min={1}
              onChange={(plusNumber) => this.setState({ plusNumber })}
            />
          </div>
        </Modal>
        <Modal
          visible={!!this.state.download}
          onCancel={this.hideDownload}
          onOk={this.download}
          okText="下载"
          title="批量下载二维码"
        >
          <div>
            <div>请输入要下载的序号区间</div>
            从
            <InputNumber
              value={this.state.downloadRange[0]}
              min={1}
              max={this.state.downloadRange[1]}
              onChange={(number) =>
                this.setState({ downloadRange: [number, this.state.downloadRange[1]] })
              }
            />
            到
            <InputNumber
              value={this.state.downloadRange[1]}
              min={1}
              max={this.state.downloadRange[1]}
              onChange={(number) =>
                this.setState({ downloadRange: [this.state.downloadRange[0]], number })
              }
            />
          </div>
        </Modal>
        <Modal
          visible={!!this.state.check}
          onCancel={this.hideCheckImages}
          onOk={this.checkImages}
          okText="开始检查"
          title="检查图片集是否完整"
        >
          <div>
            <div>请输入要检查的序号区间</div>
            从
            <InputNumber
              value={this.state.checkRange[0]}
              min={1}
              max={this.state.checkRange[1]}
              onChange={(number) =>
                this.setState({ checkRange: [number, this.state.checkRange[1]] })
              }
            />
            到
            <InputNumber
              value={this.state.checkRange[1]}
              min={1}
              max={this.state.checkRange[1]}
              onChange={(number) =>
                this.setState({ checkRange: [this.state.checkRange[0]], number })
              }
            />
          </div>
        </Modal>
      </Fragment>
    );
  }
}
function mapStateToProps({ qrBatch, app: { user } }) {
  return { ...qrBatch, user };
}
export default connect(mapStateToProps)(QrBatch);
