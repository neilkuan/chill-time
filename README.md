# 🍅 番茄鐘 Pomodoro Timer

一個簡潔美觀的番茄工作法計時器應用程式，使用 React 和 Vite 建構。

## ✨ 功能特色

- 🎯 **標準番茄工作法**: 25分鐘工作 + 5分鐘休息
- ⏰ **智能計時**: 自動切換工作和休息模式
- 🔄 **長休息**: 每完成4個番茄鐘後自動15分鐘長休息
- 📊 **統計記錄**: 追蹤完成的番茄鐘數量
- 🎨 **美觀介面**: 現代化的毛玻璃效果設計
- 📱 **響應式設計**: 支援桌面和手機裝置
- 🔊 **音效提醒**: 計時結束時播放提示音
- 🎛️ **完整控制**: 開始/暫停/重置/跳過功能
- 🌐 **多語言支援**: 支援英文、日文和繁體中文

## 🚀 快速開始

### 安裝依賴
```bash
npm install
```

### 啟動開發伺服器
```bash
npm run dev
```

應用程式將在 `http://localhost:3000` 開啟。

### 建構生產版本
```bash
npm run build
```

## 🎮 使用方法

1. **開始工作**: 點擊「開始」按鈕開始25分鐘的專注工作時間
2. **休息時間**: 工作時間結束後自動進入5分鐘休息時間
3. **長休息**: 每完成4個番茄鐘後進入15分鐘長休息
4. **控制選項**:
   - 🟢 **開始/暫停**: 開始或暫停計時器
   - 🔄 **重置**: 重置計時器到初始狀態
   - ⏭️ **跳過**: 跳到下一個階段
5. **語言選擇**:
   - 使用語言選擇器切換顯示語言（英文、日文、繁體中文）
   - 系統會記住您的語言偏好設定

## 🛠️ 技術架構

- **框架**: React 18
- **建構工具**: Vite
- **樣式**: CSS3 (毛玻璃效果、漸變背景)
- **狀態管理**: React Hooks (useState, useEffect, useRef)
- **響應式設計**: CSS Media Queries
- **國際化**: i18next, react-i18next, i18next-browser-languagedetector

## 📂 專案結構

```
pomodoro-timer/
├── src/
│   ├── App.jsx                # 主要應用組件
│   ├── App.css                # 應用樣式
│   ├── main.jsx               # 應用入口點
│   ├── index.css              # 全域樣式
│   ├── i18n.js                # i18n 配置
│   ├── components/
│   │   └── LanguageSelector.jsx # 語言選擇器組件
│   └── translations/
│       ├── en.json            # 英文翻譯
│       ├── ja.json            # 日文翻譯
│       └── zh-TW.json         # 繁體中文翻譯
├── index.html                 # HTML 模板
├── package.json               # 專案配置
├── vite.config.js             # Vite 配置
└── README.md                  # 專案說明
```

## 🎨 設計特色

- **毛玻璃效果**: 使用 `backdrop-filter: blur()` 創造現代感
- **漸變背景**: 紫色到藍色的動態漸變
- **動態配色**: 根據不同模式（工作/休息）調整主題色彩
- **進度條**: 視覺化顯示當前階段的進度
- **平滑動畫**: 所有互動都有流暢的過渡效果

## 🌐 多語言支援

應用程式支援以下語言：
- 🇺🇸 英文 (English)
- 🇯🇵 日文 (日本語)
- 🇹🇼 繁體中文

多語言功能特點：
- 自動檢測瀏覽器語言設定
- 可手動切換語言
- 語言偏好會保存在 localStorage 中
- 預設語言為英文（如果無法檢測到瀏覽器語言）

## 📈 番茄工作法原理

番茄工作法是一種時間管理技術：

1. 選擇一個任務
2. 設定25分鐘計時器（一個番茄鐘）
3. 專注工作直到計時器響起
4. 短暫休息5分鐘
5. 每4個番茄鐘後進行15-30分鐘的長休息

## 🤝 貢獻

歡迎提交 issues 和 pull requests 來改善這個專案！

## 📄 授權

MIT License