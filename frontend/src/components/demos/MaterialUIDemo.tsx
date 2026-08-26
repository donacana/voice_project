import React from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material'

const activity = [
  { name: 'Kim Min', action: 'placed an order', time: '2m ago' },
  { name: 'Lee Soo', action: 'updated profile', time: '15m ago' },
  { name: 'Park Ji', action: 'requested refund', time: '1h ago' },
]

const stats = [
  { label: 'Revenue', value: '₩1,240,000', change: '+12.5% this week' },
  { label: 'Users', value: '1,280', change: '+48 this week' },
  { label: 'Orders', value: '342', change: '24 pending' },
]

export const MaterialUIDemo: React.FC = () => (
  <Box
    className="mui-demo-root"
    sx={{ bgcolor: '#f4f6f8', minHeight: 'min(650px, 72vh)', borderRadius: 5, overflow: 'hidden' }}
  >
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
          Material Dashboard
        </Typography>
        <Button color="inherit">Reports</Button>
        <Button color="inherit">Settings</Button>
      </Toolbar>
    </AppBar>

    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ color: '#172033', fontWeight: 800 }}>
          컴포넌트를 조합하면 앱 화면이 된다
        </Typography>
        <Typography sx={{ color: '#526071', fontWeight: 600 }}>
          AppBar · Card · List · Chip · Button에 Material Design 규칙이 이미 적용되어 있습니다.
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {stats.map(stat => (
          <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
            <Card elevation={1} sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2">{stat.label}</Typography>
                <Typography variant="h4" color="text.primary" sx={{ my: .5, fontWeight: 800 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
                  {stat.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 750 }}>
              Recent activity
            </Typography>
            <List dense>
              {activity.map(item => (
                <ListItem key={item.name} disableGutters>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>{item.name[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`${item.name} · ${item.action}`} secondary={item.time} />
                  <Chip label="Active" color="success" size="small" variant="outlined" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={1} sx={{ display: 'flex', height: '100%', flexDirection: 'column', p: 2 }}>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 750 }}>
              Material action
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>
              Primary · outlined · text variant만 선택해도 일관된 상태와 간격을 얻습니다.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto', pt: 2 }}>
              <Button variant="contained">Create report</Button>
              <Button variant="outlined">Export</Button>
              <Button variant="text">Details</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  </Box>
)
