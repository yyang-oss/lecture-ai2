function saveKey() {
  const key = document.getElementById('apiKey').value.trim();
  if (!key) return alert("キーを入力してください");
  localStorage.setItem('gemini_api_key_2026', key);
  alert('APIキーを保存しました');
}

window.onload = () => {
  const savedKey = localStorage.getItem('gemini_api_key_2026');
  if (savedKey) document.getElementById('apiKey').value = savedKey;
};

function copyText(id) {
  const text = document.getElementById(id).value;
  if (!text) return;
  navigator.clipboard.writeText(text);
  alert('コピーしました！');
}

async function getAvailableModel(apiKey) {
  const versions = ['v1beta', 'v1'];
  for (const v of versions) {
      try {
          const res = await fetch(`https://generativelanguage.googleapis.com/${v}/models?key=${apiKey}`);
          const data = await res.json();
          if (data.models) {
              const found = data.models.find(m => m.name.includes('flash') && m.supportedGenerationMethods.includes('generateContent'));
              if (found) return { name: found.name, version: v };
          }
      } catch (e) { console.error(e); }
  }
  return null;
}

async function processAudio() {
  const apiKey = localStorage.getItem('gemini_api_key_2026');
  const fileInput = document.getElementById('audioFile');
  const status = document.getElementById('status');

  if (!apiKey) return alert('APIキーを保存してください');
  if (fileInput.files.length === 0) return alert('ファイルを選んでください');

  status.innerText = "⏳ 処理中...";
  
  try {
      const modelInfo = await getAvailableModel(apiKey);
      const file = fileInput.files[0];
      const base64Data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(file);
      });

      const API_URL = `https://generativelanguage.googleapis.com/${modelInfo.version}/${modelInfo.name}:generateContent?key=${apiKey}`;

      // 【改良プロンプト】三つのタグで出力させる
      const payload = {
          contents: [{
              parts: [
                  { text: "音声を解析し、以下の形式で出力してください。\n\n[TRANSCRIPT]\n文字起こし全文\n[/TRANSCRIPT]\n\n[SUMMARY]\n3行要約\n[/SUMMARY]\n\n[POINTS]\n要点（箇条書き）\n[/POINTS]" },
                  { inline_data: { mime_type: file.type, data: base64Data } }
              ]
          }]
      };

      const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });

      const result = await response.json();
      const aiResponse = result.candidates[0].content.parts[0].text;

      // タグから抜き出す関数
      const extract = (text, tag) => {
          const startTag = `[${tag}]`;
          const endTag = `[/${tag}]`;
          const start = text.indexOf(startTag);
          const end = text.indexOf(endTag);
          return (start !== -1 && end !== -1) ? text.substring(start + startTag.length, end).trim() : "";
      };

      // 三つの箱にそれぞれ流し込む
      document.getElementById('transcription').value = extract(aiResponse, "TRANSCRIPT");
      document.getElementById('summary').value = extract(aiResponse, "SUMMARY");
      document.getElementById('points').value = extract(aiResponse, "POINTS");

      status.innerText = "✅ 完了しました！";
  } catch (err) {
      status.innerText = "❌ エラー";
      alert("エラー: " + err.message);
  }
}