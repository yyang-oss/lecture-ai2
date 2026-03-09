# 講義音声ノートAI (2026 Edition)

講義や会議の音声をアップロードするだけで、「文字起こし」「要約」「要点」を瞬時に作成するWebアプリです。

## 🚀 特徴
- **爆速処理**: Gemini 3 Flashモデルを採用し、数分の音声も数十秒で解析。
- **自動仕分け**: 文字起こし全文、3行要約、箇条書きの要点を別々のエリアに出力。
- **セキュア設計**: APIキーはブラウザのlocalStorageに保存され、サーバーへは送信されません。

## 🛠 セットアップ
1. [Google AI Studio](https://aistudio.google.com/) でAPIキーを取得します。
2. アプリ画面上の入力欄にAPIキーを貼り付け、「キーを保存」を押します。
3. 音声ファイル（mp3, wav, m4a等）を選択し、「分析を実行する」を押してください。

## 📝 技術スタック
- HTML5 / CSS3 (Responsive Design)
- JavaScript (Vanilla JS)
- Google Gemini API (gemini-3-flash)
