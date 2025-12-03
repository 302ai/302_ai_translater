import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Popconfirm, message } from 'antd';
import type { GetProp, TableProps } from 'antd';
import { IPrompt } from '@/app/G5mSg9DW6c4h/type';
import { ReloadOutlined, StarOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PostModal from './PostModal';
import { DEFAULT_POST } from '@/app/G5mSg9DW6c4h/constant';

type ColumnsType<T> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataProps {
  onData: (data: any) => Promise<any>
  onUpdate: (data: IPrompt) => Promise<any>
  onDelete: (data: IPrompt) => Promise<any>
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}


// Render
const AdminTable = ({ onData, onUpdate, onDelete }: DataProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [tableHeight, setTableHeight] = useState(580)
  const [data, setData] = useState<IPrompt[]>();
  const [loading, setLoading] = useState(true);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  // post modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [showPost, setShowPost] = useState<IPrompt>(DEFAULT_POST);

  // 刷新数据
  const handleOnData = async () => {
    try {
      const page = tableParams.pagination?.current || ''
      const size = tableParams.pagination?.pageSize || ''
      const status = tableParams.filters?.status?.join(',') || ''
      const data = await onData({ page, size, status });
      setData(data.list);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data.count,
        },
      });
      // messageApi.info('数据已刷新！')
    } catch (error) {
      messageApi.warning('网络错误，获取要求列表失败！')
    }
  }

  // 修改状态
  const handleOnPublish = async (data: IPrompt) => {
    const action = data.status > 1 ? '撤销' : '发布'
    const item = JSON.parse(JSON.stringify(data))
    item.status = item.status > 1 ? 1 : 2
    try {
      // 新增/修改
      const result = await onUpdate(item)
      // 刷新列表
      await handleOnData()
      // 提示信息
      messageApi.info(`[${data.name}]${action}成功！`)
    } catch (error) {
      messageApi.warning(`网络错误，[${data.name}]${action}失败！`)
    }
  };

  // 处理确认
  const handlePostConfirm = async (data: IPrompt) => {
    const action = data.id ? `[${data.name}]修改` : `[${data.name}]添加`
    try {
      // 新增/修改
      const result = await onUpdate(data)
      // 刷新列表
      await handleOnData()
      // 提示信息
      messageApi.info(`${action}成功！`)
    } catch (error) {
      messageApi.warning(`网络错误，${action}失败！`)
    }
  };

  // 删除项目
  const handleOnDelete = async (data: IPrompt) => {
    try {
      // 新增/修改
      const result = await onDelete(data)
      // 刷新列表
      await handleOnData()
      // 选中此项
      messageApi.info(`删除[${data.name}]成功！`)
    } catch (error) {
      messageApi.warning(`网络错误，删除[${data.name}]失败！`)
    }
  };

  // Post: 打开新增弹框
  const handlePostAdd = () => {
    const item: IPrompt = JSON.parse(JSON.stringify(DEFAULT_POST));
    setShowPost(item);
    setIsPostModalOpen(true);
  };

  // Post: 打开修改弹框
  const handlePostEdit = (data: IPrompt) => {
    const item = JSON.parse(JSON.stringify(data));
    setShowPost(item);
    setIsPostModalOpen(true);
  };

  const columns: ColumnsType<IPrompt> = [
    {
      title: '用户',
      dataIndex: 'author',
      // sorter: true,
      render: (value) => value.split('-')[0]
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        { text: '待审核', value: 1 },
        { text: '已发布', value: 2 },
      ],
      render: (value) => {
        const color = value > 1 ? 'green' : 'geekblue'
        const text = value > 1 ? '已发布' : '待审核'
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '热度',
      dataIndex: 'like',
      width: '10%',
      // sorter: true,
      // render: (value) => <Space><StarOutlined />{value || '-'}</Space>
      render: (value) => <div className='flex items-center space-x-2 text-[#7728f5]'><svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3852" id="mx_n_1714385733003" width="16" height="16"><path d="M748.739048 352.865524c-32.743619-40.496762-29.915429 86.893714-68.169143 67.462095-38.253714-19.431619-27.087238-285.891048-259.169524-354.230857-92.769524-27.306667 36.766476 218.35581-104.374857 331.751619-141.165714 113.371429-340.845714 359.765333 113.615238 562.151619 0 0-235.398095-269.409524 68.144762-427.227429 69.632-36.205714-22.723048 89.941333 90.89219 179.882667 113.615238 89.965714 0 247.344762 0 247.344762s516.291048-165.059048 159.061334-607.134476z" p-id="3853" fill="#7728f5"></path></svg>{value || '-'}</div>
    },
    {
      title: '标题',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: '内容',
      dataIndex: 'content',
      width: '40%',
      // render: (value) => <div>{value.length > 120 ? value.slice(0, 120) + '...' : value}</div>
    },
    {
      title: "操作",
      dataIndex: "action",
      // fixed: 'right',
      render: (_: any, record: IPrompt) =>
        <Space>
          <Popconfirm
            onPopupClick={(e) => e.stopPropagation()}
            key="delete"
            title="删除要求"
            description="确定删除此项要求?"
            onConfirm={() => handleOnDelete(record)}
            okText="确认"
            cancelText="暂不"
            placement="left"
          >
            <Button
              icon={<DeleteOutlined />}
              size='small'
              danger
            >
              {/* 删除 */}
            </Button>
          </Popconfirm>
          <Button
            icon={<EditOutlined />}
            size='small'
            type='primary'
            onClick={() => handlePostEdit(record)}
          >
            {/* 修改 */}
          </Button>
          {
            record.status > 1 ?
              <Button
                size='small'
                type="dashed"
                // ghost
                onClick={() => handleOnPublish(record)}
              >
                撤回
              </Button> :
              <Button
                type="primary"
                size='small'
                onClick={() => handleOnPublish(record)}
              >
                发布
              </Button>

          }
        </Space>
    },
  ];

  // effect: init  
  useEffect(() => {
    handleOnData();
  }, [JSON.stringify(tableParams)]);

  // effetc: table 
  // useEffect(() => {
  // const height = Number(window.innerHeight) - 360
  // setTableHeight()
  // }, [])

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  if (loading) {
    return (
      <div className='flex w-full h-[300px] sm:h-[600px] justify-center items-center text-center'>
        数据加载中...
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-end p-2">
        <div className="input"></div>
        <Space>
          <Button
            size="middle"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={handlePostAdd}
          ></Button>

          <Button
            size="middle"
            shape="circle"
            icon={<ReloadOutlined />}
            onClick={
              () => {
                handleOnData();
                messageApi.info('数据已刷新！')
              }
            }
          ></Button>

        </Space>

      </div>
      <Table
        scroll={{ x: 'auto', y: tableHeight }}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <PostModal
        title="翻译要求"
        data={showPost}
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onConfirm={handlePostConfirm}
      />
      <>
        {contextHolder}
      </>
    </>
  );
};

export default AdminTable;