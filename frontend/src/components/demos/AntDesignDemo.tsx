import React from 'react'
import 'antd/dist/reset.css'
import {
  Button,
  Card,
  Input,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'

const { Title } = Typography

interface UserRow {
  key: string
  name: string
  status: 'Active' | 'Pending' | 'Blocked'
  orders: number
  email: string
}

const users: UserRow[] = [
  { key: '1', name: 'Kim Min', status: 'Active', orders: 128, email: 'kim@example.com' },
  { key: '2', name: 'Lee Soo', status: 'Pending', orders: 72, email: 'lee@example.com' },
  { key: '3', name: 'Park Ji', status: 'Active', orders: 201, email: 'park@example.com' },
  { key: '4', name: 'Choi Han', status: 'Blocked', orders: 45, email: 'choi@example.com' },
  { key: '5', name: 'Jung Min', status: 'Pending', orders: 96, email: 'jung@example.com' },
  { key: '6', name: 'Kang Ho', status: 'Active', orders: 154, email: 'kang@example.com' },
]

const statusColor: Record<UserRow['status'], string> = {
  Active: 'green',
  Pending: 'gold',
  Blocked: 'red',
}

export const AntDesignDemo: React.FC = () => {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [page, setPage] = React.useState(1)
  const [modalOpen, setModalOpen] = React.useState(false)
  const pageSize = 4

  const filtered = users.filter(user => {
    const matchesName = user.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesName && matchesStatus
  })
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns = [
    {
      title: '사용자',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, row: UserRow) => (
        <span className="ant-user-cell"><strong>{name}</strong><small>{row.email}</small></span>
      ),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserRow['status']) => <Tag color={statusColor[status]}>{status}</Tag>,
    },
    { title: '주문', dataIndex: 'orders', key: 'orders', sorter: (a: UserRow, b: UserRow) => a.orders - b.orders },
    {
      title: '액션',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button size="small" type="link">Edit</Button>
          <Button size="small" type="link" danger>Delete</Button>
        </Space>
      ),
    },
  ]

  return (
    <section className="ant-demo-surface">
      <div className="ant-demo-heading">
        <div>
          <Title level={2} style={{ margin: 0 }}>사용자 관리</Title>
          <p>Table · Filter · Tag · Pagination이 한 화면에서 연결되는 엔터프라이즈 UI</p>
        </div>
        <Button type="primary" size="large" onClick={() => setModalOpen(true)}>
          ＋ 새 사용자
        </Button>
      </div>

      <Card styles={{ body: { padding: 16 } }}>
        <Space style={{ display: 'flex', marginBottom: 14 }} wrap>
          <Input.Search
            allowClear
            placeholder="이름 검색"
            value={search}
            onChange={event => { setSearch(event.target.value); setPage(1) }}
            style={{ width: 230 }}
          />
          <Select
            value={statusFilter}
            onChange={value => { setStatusFilter(value); setPage(1) }}
            style={{ width: 150 }}
            options={[
              { label: '전체 상태', value: 'all' },
              { label: 'Active', value: 'Active' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Blocked', value: 'Blocked' },
            ]}
          />
          <Button>필터 초기화</Button>
        </Space>

        <Table<UserRow>
          columns={columns}
          dataSource={paged}
          pagination={false}
          size="middle"
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 14 }}>
          <Typography.Text type="secondary">총 {filtered.length}명</Typography.Text>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={filtered.length}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      </Card>

      <div className="ant-demo-caption">
        화면을 처음 열자마자 검색·선택·표·상태·액션·페이지 이동이 보여 관리자 화면 구성 속도를 설명할 수 있습니다.
      </div>

      <Modal
        title="새 사용자 추가"
        open={modalOpen}
        okText="추가"
        cancelText="취소"
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input placeholder="이름" />
          <Input placeholder="이메일" />
          <Select placeholder="상태" style={{ width: '100%' }} options={[
            { label: 'Active', value: 'Active' },
            { label: 'Pending', value: 'Pending' },
          ]} />
        </Space>
      </Modal>
    </section>
  )
}
