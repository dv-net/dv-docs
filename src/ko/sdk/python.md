# **dv-net-client를 사용하여 Python 애플리케이션에 DV.net 통합하기**

dv-net-client 라이브러리는 Python 애플리케이션에서 DV.net API와 직접 상호작용할 수 있는 편리한 방법을 제공합니다. 웹 백엔드, 스크립트 또는 기타 Python 기반 시스템을 구축하든, 이 클라이언트는 결제 요청(인보이스) 생성 및 웹훅을 통한 상태 업데이트 처리와 같은 작업을 간소화합니다.  
이 가이드는 dv-net-client를 시작하는 데 필요한 핵심 단계를 안내합니다.  
**사전 준비 사항:**

* Python 3.8 이상 설치.
* pip(파이썬 패키지 설치 도구).
* 활성화된 DV.net 계정.
* Python에 대한 기본 이해(비동기 클라이언트를 사용하는 경우 asyncio 포함).

### **1단계: DV.net 클라이언트 라이브러리 설치**

먼저 pip을 사용하여 패키지를 설치합니다. 터미널 또는 명령 프롬프트를 열고 다음을 실행하세요:  

`pip install dv-net-client`

이 명령은 클라이언트 라이브러리의 최신 버전과 해당 종속성을 다운로드하여 설치합니다.

### **2단계: DV.net API 자격 증명 획득**

DV.net API와 통신하려면 DV.net 계정에서 다음 세 가지 정보가 필요합니다:

1. **API URL:** DV.net 인스턴스의 기본 URL(예: https://api.your-dv-instance.com).
2. **API Key:** 공개 API 키.
3. **API Secret:** 비공개 API 시크릿.

이 자격 증명은 일반적으로 계정 대시보드의 "API Keys" 또는 "Developer" 섹션에서 생성할 수 있습니다.  
**중요:** API Secret은 안전하게 보관하고, 클라이언트 사이드 코드나 공개 저장소에 노출하지 마세요.

### **3단계: 클라이언트 초기화**

이 라이브러리는 동기(synchronous)와 비동기(asynchronous) 클라이언트를 모두 제공합니다. 애플리케이션 아키텍처에 맞는 방식을 선택하세요.  
**동기 클라이언트:**  
비동기 뷰를 사용하지 않는 전통적인 스크립트나 Flask/Django 같은 웹 프레임워크에 적합합니다.

```python
from dv_net_client import Client

API_URL = "YOUR_DV_NET_API_URL"  # 실제 API URL로 교체하세요
API_KEY = "YOUR_API_KEY"        # API Key로 교체하세요
API_SECRET = "YOUR_API_SECRET"    # API Secret으로 교체하세요

# 동기 클라이언트 초기화
client = Client(host=API_URL, api_key=API_KEY, api_secret=API_SECRET)

# 이제 'client' 객체를 사용하여 API 호출을 할 수 있습니다
# 예: 사용 가능한 통화 목록 가져오기
try:
    currencies_response = client.get_currencies()
    print("사용 가능한 통화:", currencies_response.currencies)
except Exception as e:
    print(f"오류가 발생했습니다: {e}")
```

**비동기 클라이언트:**  
FastAPI, Starlette 또는 비동기 스크립트 등 asyncio를 사용하는 애플리케이션에 적합합니다.  

```python
import asyncio
from dv_net_client import AsyncClient

API_URL = "YOUR_DV_NET_API_URL"  # 실제 API URL로 교체하세요
API_KEY = "YOUR_API_KEY"        # API Key로 교체하세요
API_SECRET = "YOUR_API_SECRET"    # API Secret으로 교체하세요

async def main():
    # 비동기 클라이언트 초기화
    async_client = AsyncClient(host=API_URL, api_key=API_KEY, api_secret=API_SECRET)

    # 이제 'async_client' 객체를 사용하여 API 호출을 할 수 있습니다
    # 예: 비동기 방식으로 사용 가능한 통화 목록 가져오기
    try:
        currencies_response = await async_client.get_currencies()
        print("사용 가능한 통화:", currencies_response.currencies)
    except Exception as e:
        print(f"오류가 발생했습니다: {e}")
    finally:
        # 중요: 사용 후 클라이언트 세션을 닫으세요
        await async_client.close()

if __name__ == "__main__":
    asyncio.run(main())
```
### **4단계: 결제 요청(인보이스) 생성**

인보이스 생성은 일반적인 사용 사례입니다. 금액, 통화, 선택적으로 시스템의 주문 ID 등의 세부 정보를 제공해야 합니다.  

```python
from dv_net_client import Client
from dv_net_client.dto.merchant_client import CreateInvoiceDto # DTO 가져오기

# 'client'가 3단계에서 보여준 대로 초기화되어 있다고 가정합니다

# DTO를 사용해 인보이스 세부 정보를 정의
invoice_data = CreateInvoiceDto(
    amount=10.50,               # 인보이스 금액
    currency_code="USD",        # 명목 화폐 코드(예: USD, EUR)
    order_id="MY_ORDER_123",    # 내부 주문 ID(선택 사항이지만 권장)
    description="Payment for Order #MY_ORDER_123" # 선택적 설명
    # 필요 시 return_url, success_url 같은 선택적 파라미터 추가
)

try:
    # 인보이스 생성
    invoice_response = client.create_invoice(invoice_data)

    print(f"인보이스가 성공적으로 생성되었습니다!")
    print(f"Invoice ID: {invoice_response.invoice_id}")
    print(f"Payment URL: {invoice_response.payment_url}") # 여기에 고객을 리디렉션

    # invoice_response.invoice_id를 주문 MY_ORDER_123와 함께 저장하세요
    # 사용자를 invoice_response.payment_url로 리디렉션하세요

except Exception as e:
    print(f"인보이스 생성 실패: {e}")
```
*(비동기 클라이언트의 경우, async 함수 내에서 await async_client.create_invoice(invoice_data)를 사용하세요).*

### **5단계: 웹훅 처리**

웹훅은 결제 상태(예: 인보이스 결제 완료)에 대한 실시간 업데이트를 수신하는 데 필수적입니다. DV.net은 DV.net 계정에서 구성한 URL로 POST 요청을 전송합니다.  
**보안:** 들어오는 웹훅 요청이 실제로 DV.net에서 온 것인지 검증하는 것이 중요합니다. dv-net-client는 여러분이 정의한 Webhook Secret을 사용하여 이를 검증하는 유틸리티를 제공합니다.

1. **DV.net에서 웹훅 구성:**
    * Project -> Your project -> Edit로 이동합니다.
    * 페이지에서 API key와 secret key를 가져옵니다.
    * 수신하려는 이벤트에 대한 웹훅 URL을 설정합니다(예: Confirmed transactions, Unconfirmed transaction, Withdrawal 등).
2. **애플리케이션에서 웹훅 검증 및 처리:**

```python
from fastapi import FastAPI, Request, Header, HTTPException # FastAPI 사용 예시
import uvicorn
from dv_net_client.utils import verify_webhook_signature # 서명 검증 유틸리티
from dv_net_client.mappers import WebhookMapper # 데이터 파싱 매퍼
from dv_net_client.dto.webhook import WebhookType # 웹훅 타입 Enum

# --- 설정 ---
DV_NET_WEBHOOK_SECRET = "YOUR_WEBHOOK_SECRET" # 실제 시크릿으로 교체하세요

app = FastAPI()

@app.post("/webhooks/dvnet") # Payload URL 엔드포인트
async def handle_dvnet_webhook(request: Request, x_dv_signature: str = Header(None)):
    if not x_dv_signature:
        raise HTTPException(status_code=400, detail="Missing X-DV-Signature header")

    # 원본 바디 바이트 가져오기
    raw_body = await request.body()

    # 1. 서명 검증
    if not verify_webhook_signature(
        signature=x_dv_signature,
        payload=raw_body,
        secret=DV_NET_WEBHOOK_SECRET
    ):
        print("웹훅 서명 검증 실패!")
        raise HTTPException(status_code=400, detail="Invalid signature")

    print("웹훅 서명 검증 성공.")

    # 2. 웹훅 데이터 파싱
    try:
        webhook_data = WebhookMapper.map_webhook(raw_body.decode('utf-8')) # 바이트를 문자열로 디코드
    except Exception as e:
        print(f"웹훅 데이터 파싱 오류: {e}")
        raise HTTPException(status_code=400, detail="Invalid webhook payload")

    # 3. 웹훅 타입에 따라 처리
    print(f"수신된 웹훅 타입: {webhook_data.type}")

    if webhook_data.type == WebhookType.CONFIRMED:
        # 결제 확정(= payment.completed 또는 invoice.paid)
        invoice_id = webhook_data.invoice_id
        order_id = webhook_data.order_id # 인보이스 생성 시 보낸 order_id
        print(f"결제 확정 - Invoice ID: {invoice_id}, Order ID: {order_id}")
        # --- 여기서 데이터베이스의 주문 상태를 업데이트하세요 ---
        # 'order_id' 또는 'invoice_id'로 연관된 주문을 찾고
        # 주문을 결제 완료로 표시합니다.
        # 고객에게 확인 이메일을 보낼 수도 있습니다.
        pass

    elif webhook_data.type == WebhookType.UNCONFIRMED:
        # 결제가 감지되었지만 블록체인 컨펌 대기 중(선택적 처리)
        invoice_id = webhook_data.invoice_id
        print(f"결제 미확정 - Invoice ID: {invoice_id}")
        # 주문 상태를 "컨펌 대기"로 업데이트할 수 있습니다
        pass

    elif webhook_data.type == WebhookType.WITHDRAWAL:
        # 출금 작업 관련(일반적인 인보이스 결제와는 무관)
        print(f"출금 웹훅 수신: {webhook_data}")
        pass

    else:
        # 필요 시 기타 타입 또는 알 수 없는 타입 처리
        print(f"처리되지 않은 웹훅 타입 수신: {webhook_data.type}")
        pass

    # 수신 확인을 위해 2xx 상태 코드를 반환
    return {"status": "received"}

# --- 서버 실행 예시 ---
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)
# 프로덕션 환경에서는 적절한 웹 서버(Nginx 등) 뒤에서 실행하고 HTTPS를 사용하세요.
```
*(이 예시는 FastAPI를 사용하지만, verify_webhook_signature와 WebhookMapper.map_webhook 함수는 Flask, Django 등 어떤 Python 프레임워크에서도 사용할 수 있습니다. 요청 본문과 헤더 접근 방식만 해당 프레임워크에 맞게 조정하면 됩니다.)*

### **마무리**

dv-net-client 라이브러리는 DV.net API와 상호작용하기 위한 동기 및 비동기 인터페이스와, 웹훅 검증에 필요한 필수 유틸리티를 제공합니다. 위 단계를 따르면 DV.net 암호화폐 결제를 Python 애플리케이션에 효율적이고 안전하게 통합할 수 있습니다. 사용 가능한 모든 메서드와 DTO에 대한 자세한 내용은 라이브러리의 소스 코드나 문서를 참고하세요.