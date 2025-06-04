import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './App.css'
import LanguageSelector from './components/LanguageSelector'

const WORK_TIME = 25; // Work time 25 minutes
const BREAK_TIME = 5;  // Break time 5 minutes
const LONG_BREAK_TIME = 15; // Long break time 15 minutes

function App() {
  const { t } = useTranslation();
  const [minutes, setMinutes] = useState(WORK_TIME);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'break', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const intervalRef = useRef(null);

  // Check and request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        // Automatically request notification permission
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
          // Time's up
          setIsActive(false);
          handleTimerComplete();
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds]);

  // Show browser notification
  const showNotification = (title, body, icon = '🍅') => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj7wn42F8J+NhTwvdGV4dD4KPHN2Zz4K',
        badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj7wn42F8J+NhTwvdGV4dD4KPHN2Zz4K',
        tag: 'pomodoro-timer',
        requireInteraction: true, // Requires user interaction to dismiss
        silent: false
      });

      // Focus on the application when notification is clicked
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Automatically close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  };

  const handleTimerComplete = () => {
    // Play sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEbBTGH0fPTgjMGHm7A7+OZURE');
    audio.play().catch(() => {}); // Ignore errors, some browsers require user interaction to play audio

    if (mode === 'work') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      if (newCount % 4 === 0) {
        // Long break after 4 pomodoros
        setMode('longBreak');
        setMinutes(LONG_BREAK_TIME);
        showNotification(
          t('notifications.longBreakComplete'),
          t('notifications.longBreakMessage', { longBreakTime: LONG_BREAK_TIME })
        );
      } else {
        // Short break
        setMode('break');
        setMinutes(BREAK_TIME);
        showNotification(
          t('notifications.workComplete'),
          t('notifications.workCompleteMessage', { count: newCount, breakTime: BREAK_TIME })
        );
      }
    } else {
      // Break is over, start working
      setMode('work');
      setMinutes(WORK_TIME);
      const breakType = mode === 'longBreak' ? t('notifications.longBreak') : t('notifications.shortBreak');
      showNotification(
        t('notifications.breakComplete'),
        t('notifications.breakCompleteMessage', { breakType: breakType, workTime: WORK_TIME })
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

  // Manually request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        showNotification(
          t('notifications.notificationsEnabled'),
          t('notifications.notificationsEnabledMessage')
        );
      }
    }
  };

  const formatTime = (min, sec) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getModeText = () => {
    return t(`modes.${mode}`);
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
        
        {/* Notification permission status */}
        {notificationPermission !== 'granted' && (
          <div className="notification-banner">
            <p>{t('notifications.enable')}</p>
            <button 
              className="notification-btn"
              onClick={requestNotificationPermission}
            >
              {t('notifications.enableButton')}
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
            <span className="stat-label">{t('stats.completedPomodoros')}</span>
          </div>
        </div>
        
        <div className="instructions">
          <h3>{t('instructions.title')}</h3>
          <ul>
            <li>{t('instructions.work')}</li>
            <li>{t('instructions.shortBreak')}</li>
            <li>{t('instructions.cycle')}</li>
            <li>{t('instructions.notifications')}</li>
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