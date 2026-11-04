# 萬用發言產生器

單一 HTML 的繁體中文發言創作工具，支援離線規則生成與可選的 Puter.js 線上模式。所有產生內容均為虛構修辭示範，不代表真實人物發言。

網站：https://chiaotm221.github.io/speech-generator/

## 使用

在瀏覽器開啟網站，輸入主題，選擇風格、長度、語氣及空洞程度，按「產生發言」。可重新產生或複製全文。

離線生成不需 API Key；線上模式使用第三方服務，可能需要登入或消耗額度。網站尚未提供離線重新開啟的快取功能。

## 部署與更新

GitHub Pages 使用 `main` 分支的 `/(root)`。根目錄 `index.html` 是網站入口，`.nojekyll` 讓 GitHub 直接發布靜態檔案，無需安裝套件或編譯。

首次發布內容來自 `Releases/V0.1.01/index.html`。日後更新版本時，將新版本複製至根目錄 `index.html`，提交並推送至 `main`，GitHub Pages 就會自動重新部署。部署結果可在儲存庫 Actions 查看。

需求與後續規劃見 `plan.md`。iPad/iPhone 請使用 Safari 開啟上述 HTTPS 網址。
