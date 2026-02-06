## API를 사용하지 않고 결제 폼 연결하기

다음 간단한 단계만 따라 하면 API 연동 없이도 결제 폼을 연결할 수 있습니다.

연동 예시는 [이 저장소](https://github.com/dv-net/simple-payment-form)에서 확인할 수 있습니다.

### 1. 스토어의 결제 링크 활성화

프로젝트 계정에 로그인한 후 **Projects**, **Edit**, **Advanced settings**로 이동합니다.

맨 아래에 있는 "Form without API" 스위치를 찾습니다.

<a href="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>PayForm</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'PayForm\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

여기에서 API 없이 사용하는 결제 폼 링크를 확인할 수 있으며, 이 링크에는 스토어의 UUID(고유 식별자)가 포함되어 있습니다.

### 2. 결제 링크 수정

다음 형식으로 결제 링크를 생성하세요:

`http(s)://{your-domain-or-subdomain}/pay/store/{store-uuid}/{client-id}`

#### 항목 설명:

* `{your-domain-or-subdomain}` — 등록된 도메인 또는 서브도메인.
* `{store-uuid}` — 스토어의 UUID(스토어 링크에 명시됨).
* `{client-id}` — 링크 생성 시 지정하는 고유한 클라이언트 식별자입니다. 결제 추적 및 올바른 클라이언트 지갑과의 연결에 필요합니다.

> ⚠️ **중요:** 올바른 추적과 식별을 위해 각 클라이언트 세션마다 `client-id`는 고유해야 합니다.

-----

예시:

`https://demo.dv.net/pay/store/0cbffe2b-d2a5-433d-94f5-77ce93a7c0eb/<your client ID>`

링크를 생성한 뒤에는 클라이언트를 해당 링크로 리디렉션하거나, 웹사이트의 버튼에 링크를 삽입해 사용할 수 있습니다.