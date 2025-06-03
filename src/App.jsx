import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './components/LanguageSelector'
import './App.css'

const WORK_TIME = 25; // 工作時間 25 分鐘
const BREAK_TIME = 5;  // 休息時間 5 分鐘
const LONG_BREAK_TIME = 15; // 長休息時間 15 分鐘

function App() {
  const { t } = useTranslation();
  const [minutes, setMinutes] = useState(WORK_TIME);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'break', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const intervalRef = useRef(null);

  // 檢查並請求通知權限
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        // 自動請求通知權限
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // 時間到了
          setIsActive(false);
          handleTimerComplete();
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds]);

  // 顯示瀏覽器通知
  const showNotification = (title, body, icon = '🍅') => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj7wn42F8J+NhTwvdGV4dD4KPHN2Zz4K',
        badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj7wn42F8J+NhTwvdGV4dD4KPHN2Zz4K',
        tag: 'pomodoro-timer',
        requireInteraction: true, // 需要用戶互動才會消失
        silent: false
      });

      // 點擊通知時聚焦到應用程式
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // 5秒後自動關閉通知
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  };

  const handleTimerComplete = () => {
    // 播放提示音
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEbBTGH0fPTgjMGHm7A7+OZURE');
    audio.play().catch(() => {}); // 忽略錯誤，有些瀏覽器需要用戶互動才能播放音頻

    if (mode === 'work') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      if (newCount % 4 === 0) {
        // 每完成 4 個番茄鐘後長休息
        setMode('longBreak');
        setMinutes(LONG_BREAK_TIME);
        showNotification(
          t('notifications.longBreakStart.title'),
          t('notifications.longBreakStart.message', { minutes: LONG_BREAK_TIME })
        );
      } else {
        // 短休息
        setMode('break');
        setMinutes(BREAK_TIME);
        showNotification(
          t('notifications.workComplete.title'),
          t('notifications.workComplete.message', { count: newCount, minutes: BREAK_TIME })
        );
      }
    } else {
      // 休息結束，開始工作
      setMode('work');
      setMinutes(WORK_TIME);
      const restType = mode === 'longBreak' ? t('breakTypes.long') : t('breakTypes.short');
      showNotification(
        t('notifications.breakComplete.title'),
        t('notifications.breakComplete.message', { type: restType, minutes: WORK_TIME })
      );
    }
    setSeconds(0);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setMinutes(WORK_TIME);
    setSeconds(0);
  };

  const skipTimer = () => {
    setIsActive(false);
    handleTimerComplete();
  };

  // 手動請求通知權限
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        showNotification(
          t('notification.enabled'),
          t('notification.enabledMessage')
        );
      }
    }
  };

  const formatTime = (min, sec) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getModeText = () => {
    switch (mode) {
      case 'work':
        return t('modes.work');
      case 'break':
        return t('modes.break');
      case 'longBreak':
        return t('modes.longBreak');
      default:
        return t('modes.work');
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return '#e74c3c';
      case 'break':
        return '#27ae60';
      case 'longBreak':
        return '#3498db';
      default:
        return '#e74c3c';
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">{t('appTitle')}</h1>
        
        {/* Language Selector */}
        <LanguageSelector />
        
        {/* 通知權限狀態 */}
        {notificationPermission !== 'granted' && (
          <div className="notification-banner">
            <p>{t('notification.enable')}</p>
            <button 
              className="notification-btn"
              onClick={requestNotificationPermission}
            >
              {t('notification.enableButton')}
            </button>
          </div>
        )}
        
        <div className="timer-card" style={{ borderColor: getModeColor() }}>
          <div className="mode-display" style={{ color: getModeColor() }}>
            {getModeText()}
          </div>
          
          <div className="timer-display" style={{ color: getModeColor() }}>
            {formatTime(minutes, seconds)}
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                backgroundColor: getModeColor(),
                width: `${((mode === 'work' ? WORK_TIME : mode === 'break' ? BREAK_TIME : LONG_BREAK_TIME) * 60 - (minutes * 60 + seconds)) / ((mode === 'work' ? WORK_TIME : mode === 'break' ? BREAK_TIME : LONG_BREAK_TIME) * 60) * 100}%`
              }}
            />
          </div>
          
          <div className="controls">
            <button 
              className={`control-btn ${isActive ? 'pause' : 'start'}`}
              onClick={toggleTimer}
              style={{ backgroundColor: getModeColor() }}
            >
              {isActive ? t('controls.pause') : t('controls.start')}
            </button>
            
            <button 
              className="control-btn reset"
              onClick={resetTimer}
            >
              {t('controls.reset')}
            </button>
            
            <button 
              className="control-btn skip"
              onClick={skipTimer}
            >
              {t('controls.skip')}
            </button>
          </div>
        </div>
        
        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">{pomodoroCount}</span>
            <span className="stat-label">{t('stats.completed')}</span>
          </div>
        </div>
        
        <div className="instructions">
          <h3>{t('instructions.title')}</h3>
          <ul>
            {t('instructions.items', { returnObjects: true }).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-content">
          <p>{t('footer.madeWith')} <strong>Neil Kuan</strong></p>
          <a 
            href="https://github.com/neilkuan/chill-time" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            <span>{t('footer.repository')}</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;