import { Link, Route, Routes } from 'react-router-dom'
import { Button, Layout, Tooltip, Typography } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import HomePage from './pages/HomePage.jsx'
import SubjectPage from './pages/SubjectPage.jsx'
import StudyPage from './pages/StudyPage.jsx'
import ExamPage from './pages/ExamPage.jsx'
import ExamResultPage from './pages/ExamResultPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import WrongPage from './pages/WrongPage.jsx'
import SubjectSettingsPage from './pages/SubjectSettingsPage.jsx'
import AddSubjectPage from './pages/AddSubjectPage.jsx'
import BackupPage from './pages/BackupPage.jsx'
import ComingSoonPage from './pages/ComingSoonPage.jsx'
import BackBar from './components/BackBar.jsx'
import { useTheme } from './hooks/useTheme.jsx'

const { Header, Content } = Layout

export default function App() {
  const { mode, toggle } = useTheme()
  const dark = mode === 'dark'
  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <Link to="/">
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            Ôn thi trắc nghiệm
          </Typography.Title>
        </Link>
        <Tooltip title={dark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}>
          <Button
            type="text"
            aria-label={dark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            icon={dark ? <SunOutlined /> : <MoonOutlined />}
            style={{ color: '#fff' }}
            onClick={toggle}
          />
        </Tooltip>
      </Header>
      <Content className="page" style={{ width: '100%' }}>
        <BackBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddSubjectPage />} />
          <Route path="/backup" element={<BackupPage />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/subject/:subjectId/study" element={<StudyPage />} />
          <Route path="/subject/:subjectId/exam" element={<ExamPage />} />
          <Route path="/subject/:subjectId/wrong" element={<WrongPage />} />
          <Route path="/subject/:subjectId/history" element={<HistoryPage />} />
          <Route path="/subject/:subjectId/history/:entryId" element={<ExamResultPage />} />
          <Route path="/subject/:subjectId/settings" element={<SubjectSettingsPage />} />
          <Route path="*" element={<ComingSoonPage title="Không tìm thấy trang" />} />
        </Routes>
      </Content>
    </Layout>
  )
}
