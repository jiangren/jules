import React, { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [logs, setLogs] = useState([]);
  const wsRef = useRef(null);
  const endOfLogsRef = useRef(null);

  useEffect(() => {
    // 建立 WebSocket 连接
    const ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'log') {
          setLogs((prev) => [...prev, data]);
        }
      } catch (e) {
        console.error('WebSocket message parsing error', e);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    // 自动滚动到最新日志
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Insight 抓取监控面板</h1>
        <p>实时查看抓取任务进度与日志</p>
      </header>
      <main className="log-container">
        {logs.length === 0 ? (
          <div className="no-logs">暂无日志...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="log-item">
              <span className="log-time">[{new Date(log.time).toLocaleTimeString()}]</span>
              <span className="log-platform">[{log.platform}]</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
        <div ref={endOfLogsRef} />
      </main>
    </div>
  );
}

export default App;