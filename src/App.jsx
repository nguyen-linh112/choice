import { Link, Route, Routes } from 'react-router-dom'
import { Layout, Typography } from 'antd'
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

const { Header, Content } = Layout

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
        <Link to="/">
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            Ôn thi trắc nghiệm
          </Typography.Title>
        </Link>
      </Header>
      <Content className="page" style={{ width: '100%' }}>
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
