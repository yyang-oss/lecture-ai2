# AIプロンプト設計

## 重要指示（システムプロンプト相当）
AIがプログラムで扱いやすい形式で回答を返すよう、以下の構造化指示をJS内で発行。

> 「提供した音声を解析し、以下の形式で出力してください。余計な挨拶や説明は一切不要です。[TRANSCRIPT]文字起こし[/TRANSCRIPT]...」

## 根拠・参考
- Google AI Studio API Reference (2026)
- Web API LocalStorage Standard
