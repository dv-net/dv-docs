# DV.net 결제 게이트웨이 확장 기능으로 OpenCart에서 암호화폐 결제를 받는 방법

암호화폐 결제를 제공하면 OpenCart 스토어의 사용자층을 확대하고 현대적인 결제 유연성을 제공할 수 있습니다. DV.net은 강력한 암호화폐 결제 처리 솔루션을 제공하며, OpenCart 확장 기능을 통해 통합 과정을 간소화합니다.
이 가이드는 OpenCart 웹사이트에 DV.net 결제 게이트웨이 확장 기능을 설치하고 구성하는 단계별 안내를 제공합니다.

## 준비사항:

- 활성화된 OpenCart 웹사이트
- OpenCart 대시보드 관리자 접근 권한
- 활성화된 DV.net 계정

## 1단계: DV.net OpenCart 확장 기능 받기

먼저 확장 파일을 다운로드해야 합니다. 공식 DV.net GitHub 저장소에서 얻을 수 있습니다.

- DV.net OpenCart 확장 기능 공식 저장소로 이동: https://github.com/dv-net/dv-opencart
- Releases 페이지로 이동
- `dv-opencart-vX.X.X.ocmod.zip` 다운로드

## 2단계: OpenCart 사이트에 확장 기능 설치

OpenCart는 업로드를 처리하기 위해 Extension Installer를 사용합니다.

- OpenCart 관리자 대시보드에 로그인 (예: yourdomain.com/admin)
- 왼쪽 메뉴에서 Extensions > Installer로 이동
- Upload 버튼 클릭
- 1단계에서 다운로드한 .zip 파일 선택
- 업로드 및 설치가 완료될 때까지 기다립니다. 성공 메시지가 표시되어야 합니다.
- 중요: 설치 후 Extensions > Modifications로 이동하여 오른쪽 상단의 파란색 Refresh 버튼을 클릭해 변경 사항이 시스템에 반영되도록 합니다.
- 테마 캐시를 비우는 것도 좋습니다. Dashboard로 이동해 오른쪽 상단의 파란색 톱니바퀴(Settings) 아이콘을 클릭한 다음 Theme Cache와 SASS Cache의 Refresh 버튼을 클릭합니다.

## 3단계: DV.net API 자격 증명 받기

스토어를 DV.net에 연결하려면 API Key, API Secret, API URL이 필요합니다.

- DV.net 계정 대시보드에 로그인
- 프로젝트를 찾거나 새로 생성
- API Keys 섹션으로 이동: Projects -> 특정 프로젝트의 Edit 버튼 (문서 파일의 obtaining-api-key-and-secret.md 참고)
- API key와 secret key가 표시됩니다. 필요 시 재발급할 수 있습니다.
- 아래 섹션에서 웹훅 URL을 제공합니다. 기본적으로 성공 결제에 대한 웹훅만 필요합니다.

## 4단계: OpenCart에서 DV.net 게이트웨이 구성

이제 OpenCart 관리자 패널에서 결제 수단을 구성합니다.

- OpenCart 대시보드에서 Extensions > Extensions로 이동
- "Choose the extension type" 드롭다운에서 Payments 선택
- 목록을 아래로 스크롤하여 "DV.net Gateway"를 찾습니다. 아직 설치되지 않았다면 초록색 Install(+) 버튼을 클릭하고, 그 다음 파란색 Edit(연필) 버튼을 클릭합니다.
- DV.net 구성 페이지가 열립니다. 다음 정보를 입력하세요:
- API URL: 3단계에서 받은 API URL을 붙여넣기
- API Key: 3단계에서 받은 API Key를 붙여넣기
- API Secret: 3단계에서 받은 API Secret을 붙여넣기
- 

## 5단계: DV.net 계정에서 웹훅 구성

이제 스토어가 DV.net으로 결제 요청을 보낼 준비가 되었습니다. 마지막 단계는 DV.net이 결제 상태 업데이트("Paid" 또는 "Failed" 등)를 스토어로 다시 보낼 수 있도록 웹훅을 설정하는 것입니다.

1. DV.net 계정 대시보드로 돌아갑니다.
2. Webhooks 또는 Developer 섹션으로 이동합니다.
3. 새 웹훅을 생성합니다.
4. Payload URL: 가장 중요한 부분입니다. 스토어의 고유 웹훅 URL은 `https://example.com/wc-api/dv_gateway/` 입니다(예시의 example.com을 실제 웹사이트 주소로 바꾸세요. https:// 사용을 확인하세요).
5. 여기 웹훅 주소를 입력하세요(woo의 경우 대략 `https://example.com/index.php?route=extension/payment/dv_gateway/callback`) 그리고 Create를 누르세요.
6. Events: 요청 시, 이 웹훅이 수신해야 하는 이벤트를 선택합니다. 다음과 같은 모든 결제 관련 이벤트를 활성화해야 합니다.
    1. Confirmed payment
    2. Unconfirmed payment (i.e when customer will send their payment via BTC and )
    3. Processing withdrawal (currently unsupported by this integration)
7. DV.net 대시보드에서 웹훅을 저장하고 활성화합니다.

## 6단계: 통합 테스트!

- 이제 DV.net OpenCart 통합이 완료되었습니다! 테스트 거래를 수행하는 것이 매우 중요합니다.
- OpenCart 스토어의 프런트엔드에 방문합니다.
- 상품을 장바구니에 담습니다.
- 결제 단계로 진행합니다.
- 결제 수단에서 "DV.net Gateway"를 선택합니다(또는 구성한 제목. OpenCart 확장에서는 보통 고정됨).
- 주문을 확인합니다. DV.net 결제 페이지로 리디렉션되어야 합니다.
- 강력 권장: 소액의 실제 거래를 완료하세요. DV.net에서 결제가 성공한 후 OpenCart 관리자 패널 > Sales > Orders로 이동합니다. 테스트 주문의 상태가 'Pending'에서 'Paid' 상태(예: 'Processing' 또는 'Complete')로 자동 업데이트되었는지 확인합니다.
주문 상태가 수동 개입 없이 올바르게 업데이트되면 설정이 성공적으로 완료된 것입니다! 이제 고객은 OpenCart 스토어에서 DV.net을 통해 암호화폐로 결제할 수 있습니다.