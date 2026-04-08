# 개인 키 내보내기

개인 키는 특정 주소의 자금에 직접 접근합니다. DV.net에서는 한 주소 또는 여러 주소에 대해 내보낼 수 있습니다.

> ⚠️ **개인 키는 지갑 전체 접근 권한입니다.** 공유하지 말고 이메일·메신저로 보내지 마세요. 사용 후 파일을 삭제하세요.

## 단일 주소 내보내기

1. **Transfers → Hot Wallets**로 이동
2. 필요 시 **Hide addresses with low balance** 해제
3. 검색으로 주소 찾기
4. 주소 왼쪽 체크박스 선택
5. 표 오른쪽 위 **Download keys** 클릭
6. **JSON** 또는 **CSV** 선택
7. 2단계 인증 완료
8. 안전한 위치에 파일 저장

<a href="../../assets/images/onboarding/export-keys/keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>단일 키 내보내기</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'단일 키 내보내기\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## 대량 내보내기

1. **Transfers → Hot Wallets**
2. 필요 시 **Hide addresses with low balance** 해제
3. 체크박스로 주소 선택
   - **Select all on page** — 현재 페이지 전체
   - **Select all (N)** — 모든 페이지 전체
4. 목록 상단 **Download keys**
5. **JSON** 또는 **CSV**
6. 2단계 인증
7. 안전하게 저장

<a href="../../assets/images/onboarding/export-keys/mass-keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>대량 내보내기</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'대량 내보내기\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/mass-keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## 파일 형식

### JSON
스크립트 처리에 적합합니다. 네트워크 목록과 각 항목의 공개 키, 개인 키, 주소가 있습니다:
```json
{
  "entries": [
    {
      "name": "BLOCKCHAIN_ETHEREUM",
      "items": [
        {
          "public_key": "04...e68",
          "private_key": "0x...fb5",
          "address": "0x...2b26"
        }
      ]
    }
  ]
}
```

### CSV
Excel 등에 적합합니다. 행마다 네트워크, 공개 키, 개인 키, 주소:
```
blockchain,public_key,private_key,address
BLOCKCHAIN_ETHEREUM,04...e68,0x...fb5,0x...2b26
```

## 내보낸 후

- 암호화 스토리지 또는 오프라인에 보관
- 작업이 끝나면 일상 기기에서 파일 삭제
- 다른 지갑으로 가져왔다면 작업 후 제거
- 유출이 의심되면 해당 주소로 입금 수신 중단
