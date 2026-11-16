import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import App from './App.jsx'
import { SubjectsProvider } from './hooks/useSubjects.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={viVN} theme={{ token: { borderRadius: 8 } }}>
      <HashRouter>
        <SubjectsProvider>
          <App />
        </SubjectsProvider>
      </HashRouter>
    </ConfigProvider>
  </React.StrictMode>,
)
