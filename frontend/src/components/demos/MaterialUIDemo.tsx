import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material'

// Small component-structure code example shown alongside the dashboard.
const structureCode = `// 완성된 화면 = 컴포넌트 조합
<AppBar />   // 상단 앱 바
<Card />     // 데이터 카드
<Button />   // 액션 버튼
<Grid />     // 레이아웃`

export const MaterialUIDemo: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#0f1117', minHeight: '100%', color: '#e0e0e0' }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Reports</Button>
          <Button color="inherit">Settings</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {/* Stat cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ bgcolor: '#1a1d27', color: '#e0e0e0' }}>
              <CardContent>
                <Typography color="#9ca3af" variant="subtitle2">Revenue</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
                  ₩1,240,000
                </Typography>
                <Typography variant="caption" color="#9ca3af">+12.5% this week</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ bgcolor: '#1a1d27', color: '#e0e0e0' }}>
              <CardContent>
                <Typography color="#9ca3af" variant="subtitle2">Users</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#646cff' }}>
                  1,280
                </Typography>
                <Typography variant="caption" color="#9ca3af">+48 new this week</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ bgcolor: '#1a1d27', color: '#e0e0e0' }}>
              <CardContent>
                <Typography color="#9ca3af" variant="subtitle2">Orders</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800' }}>
                  342
                </Typography>
                <Typography variant="caption" color="#9ca3af">24 pending</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Recent activity list */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ bgcolor: '#1a1d27', p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#e0e0e0' }}>
                Recent Activity
              </Typography>
              <List>
                {[
                  { name: 'Kim Min', action: 'placed an order', time: '2m ago', color: '#646cff' },
                  { name: 'Lee Soo', action: 'updated profile', time: '15m ago', color: '#4caf50' },
                  { name: 'Park Ji', action: 'requested refund', time: '1h ago', color: '#ff9800' },
                  { name: 'Choi Han', action: 'signed up', time: '3h ago', color: '#f44336' },
                ].map((item, i) => (
                  <React.Fragment key={i}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: item.color }}>{item.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<span style={{ color: '#e0e0e0' }}>{item.name} <span style={{ color: '#9ca3af' }}>{item.action}</span></span>}
                        secondary={item.time}
                        slotProps={{ secondary: { sx: { color: '#6b7280' } } }}
                      />
                      <Chip label="Active" size="small" sx={{ bgcolor: 'rgba(76,175,80,0.15)', color: '#4caf50' }} />
                    </ListItem>
                    {i < 3 && <Divider sx={{ borderColor: '#2a2d38' }} />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Structure code example */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ bgcolor: '#1a1d27', p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#e0e0e0' }}>
                완성형 = 컴포넌트 조합
              </Typography>
              <Box
                component="pre"
                sx={{
                  bgcolor: 'rgba(0,0,0,0.4)',
                  border: '1px solid #444',
                  borderRadius: 1,
                  p: 2,
                  color: '#10b981',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.8,
                  m: 0,
                  overflowX: 'auto',
                }}
              >
                {structureCode}
              </Box>
              <Typography variant="body2" color="#9ca3af" sx={{ mt: 2 }}>
                Material UI는 디자인이 적용된 완성형 컴포넌트를 조합해
                빠르게 완성된 앱 화면을 만듭니다.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}