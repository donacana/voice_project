import React from 'react'
import 'antd/dist/reset.css'
import {
  Table,
  Input,
  Select,
  Tag,
  Space,
  Card,
  Button,
  Pagination,
  Typography,
  Badge,
} from 'antd'

const { Title, Text } = Typography

interface UserRow {
  key: string
  name: string
  status: 'Active' | 'Pending' | 'Blocked'
  orders: number
  email: string
}

const data: UserRow[] = [
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
  const pageSize = 4

  const filtered = data.filter(row => {
    const matchSearch = row.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || row.status === statusFilter
    return matchSearch && matchStatus
  })

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, row: UserRow) => (
        <Space>
          <Badge status="processing" />
          <span style={{ color: '#e0e0e0' }}>{name}</span>
          <Text type="secondary" style={{ fontSize: 12 }}>{row.email}</Text>
        </Space>
      ),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserRow['status']) => (
        <Tag color={statusColor[status]}>{status}</Tag>
      ),
    },
    {
      title: '주문',
      dataIndex: 'orders',
      key: 'orders',
      render: (orders: number) => <span style={{ color: '#e0e0e0' }}>{orders}</span>,
    },
    {
      title: '액션',
      key: 'action',
      render: () => (
        <Space>
          <Button size="small" type="link">Edit</Button>
          <Button size="small" type="link" danger>Delete</Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px', background: '#0f1117', minHeight: '100%' }}>
      <Title level={3} style={{ color: '#646cff', marginTop: 0 }}>
        사용자 관리
      </Title>

      <Card
        style={{ background: '#1a1d27', borderColor: '#2a2d38' }}
        styles={{ body: { padding: '16px' } }}
      >
        {/* Search + Filter toolbar */}
        <Space style={{ marginBottom: 16, width: '100%' }} wrap>
          <Input
            prefix={<span style={{ color: '#9ca3af' }}>🔍</span>}
            placeholder="이름 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220, background: '#0f1117', color: '#e0e0e0' }}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140 }}
            options={[
              { label: '전체 상태', value: 'all' },
              { label: 'Active', value: 'Active' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Blocked', value: 'Blocked' },
            ]}
          />
          <Button type="primary">⚙ Filter</Button>
          <Button type="primary" style={{ marginLeft: 'auto' }}>
            ＋ 새 사용자
          </Button>
        </Space>

        {/* Data table */}
        <Table
          columns={columns}
          dataSource={paged}
          pagination={false}
          size="middle"
          style={{ background: '#1a1d27' }}
          rowClassName={() => 'ant-table-row-dark'}
        />

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={filtered.length}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      </Card>

      <Card
        style={{ background: '#1a1d27', borderColor: '#2a2d38', marginTop: 16 }}
        styles={{ body: { padding: '16px' } }}
      >
        <Text style={{ color: '#9ca3af' }}>
          Ant Design은 Table · Form · Filter · Pagination처럼 기업용 관리자 화면에서
          반복적으로 필요한 UI가 풍부해서 데이터가 많고 업무 흐름이 복잡한 화면을 만들기 좋습니다.
        </Text>
      </Card>
    </div>
  )
}