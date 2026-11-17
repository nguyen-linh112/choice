import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import viVN from 'antd/locale/vi_VN'
import App from './App.jsx'
import { SubjectsProvider } from './hooks/useSubjects.jsx'
import { ThemeProvider, readInitialMode, useTheme } from './hooks/useTheme.jsx'
import './styles.css'

// Đặt chế độ sáng/tối ngay trước khi vẽ để không bị chớp màu
document.documentElement.dataset.theme = readInitialMode()

function Themed({ children }) {
  const { mode } = useTheme()
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: { borderRadius: 8 },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Themed>
        <HashRouter>
          <SubjectsProvider>
            <App />
          </SubjectsProvider>
        </HashRouter>
      </Themed>
    </ThemeProvider>
  </React.StrictMode>,
)
