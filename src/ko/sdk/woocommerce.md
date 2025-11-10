# DV.net WooCommerce 플러그인으로 WordPress에서 암호화폐 결제 받기

전자상거래 스토어에 암호화폐 결제 게이트웨이를 통합하면 고객층을 넓히고 현대적이고 안전한 결제 옵션을 제공할 수 있습니다. DV.net은 이러한 트랜잭션을 처리하기 위한 강력한 솔루션을 제공하며, 전용 WooCommerce 플러그인을 통해 통합 과정을 간편하게 만들어 줍니다.
이 가이드는 WordPress 사이트에 DV.net WooCommerce 플러그인을 설치하고 구성하는 과정을 단계별로 안내합니다.

## 사전 준비 사항:

- 활성화된 WordPress 웹사이트
- WooCommerce 플러그인 설치 및 활성화
- 활성화된 DV.net 계정

## 1단계: DV.net WooCommerce 플러그인 받기

첫 단계는 플러그인 파일을 다운로드하는 것입니다. 공식 WordPress 저장소의 플러그인과 달리, 이 플러그인은 DV.net GitHub 페이지에서 받습니다.

공식 DV.net WooCommerce 플러그인 저장소로 이동하세요: https://github.com/dv-net/dv-woocommerce (이 링크는 제공된 파일에 포함되어 있습니다).
- 오른쪽 메뉴에서 Releases 섹션을 클릭합니다.
- 최신 버전의 메뉴에서 "Source code (zip)"를 선택합니다.
- .zip 파일을 컴퓨터에 저장합니다. 압축을 풀지 마세요.

## 2단계: WordPress 사이트에 플러그인 설치

이제 다운로드한 ZIP 파일을 WordPress 관리자 대시보드에 업로드합니다.
1. WordPress 관리자 영역에 로그인합니다(예: yourdomain.com/wp-admin).
2. 왼쪽 메뉴에서 Plugins > Add New로 이동합니다.
3. "Add Plugins" 페이지 상단에서 Upload Plugin 버튼을 클릭합니다.
4. "Choose File" 버튼을 클릭하고 방금 다운로드한 dv-woocommerce-main.zip 파일을 선택합니다.
5. Install Now를 클릭합니다.
6. WordPress가 플러그인 설치를 완료하면 Activate Plugin 버튼을 클릭합니다.
이제 활성 플러그인 목록에서 "DV.net WooCommerce Plugin"을 확인할 수 있습니다.

## 3단계: DV.net API 자격 증명 받기

스토어를 DV.net에 연결하려면 API Key, API Secret, API URL이 필요합니다.

- DV.net 계정 대시보드에 로그인합니다.
- 프로젝트를 찾거나 새 프로젝트를 생성합니다.
- API Keys 섹션으로 이동: Projects -> 특정 프로젝트의 Edit 버튼(문서 파일의 obtaining-api-key-and-secret.md 참고).
- API key와 secret key가 표시됩니다. 필요하면 재발급할 수 있습니다.
- 아래 섹션에서 웹훅(URL)들을 제공합니다. 기본적으로 성공적인 결제에 대한 웹훅만 있으면 됩니다.

## 4단계: WooCommerce에서 DV.net 게이트웨이 구성

API 키를 준비했다면, 이제 WooCommerce 내에서 플러그인 설정을 구성할 수 있습니다.

1. WordPress 대시보드에서 WooCommerce > Settings로 이동합니다.
2. 상단의 Payments 탭을 클릭합니다.
3. 결제 수단 목록에서 "DV.net"을 확인하고 오른쪽의 Manage 버튼을 클릭합니다.
4. DV.net 설정 페이지가 열립니다. 다음 필드를 입력하세요:
   1. Enable/Disable: 체크박스 "Enable DV.net"을 선택하여 결제 수단을 체크아웃에 표시합니다.
   2. Title: 고객이 결제 수단을 선택할 때 보게 될 텍스트입니다. 예: "Pay with Crypto via DV.net".
   3. Description: 제목 아래에 표시되는 짧은 텍스트입니다. 예: "Securely pay with cryptocurrency."
   4. API URL: API URL을 붙여넣습니다.
   5. API Key: 3단계에서 저장한 API Key를 붙여넣습니다.
   6. API Secret: 3단계에서 저장한 API Secret을 붙여넣습니다.
5. 페이지 하단의 Save changes 버튼을 클릭합니다.

## 5단계: DV.net 계정에서 웹훅 구성

이제 스토어는 결제 요청을 DV.net으로 보낼 준비가 되었습니다. 마지막 단계는 DV.net이 결제 상태 업데이트("Paid" 또는 "Failed" 등)를 스토어로 다시 보낼 수 있도록 웹훅을 설정하는 것입니다.

1. DV.net 계정 대시보드로 돌아갑니다.
2. Webhooks 또는 Developer 섹션으로 이동합니다.
3. 새 웹훅을 생성합니다.
4. Payload URL: 가장 중요한 부분입니다. 스토어의 고유 웹훅 URL은 다음과 같습니다: `https://example.com/wc-api/dv_gateway/` (example.com을 실제 웹사이트 주소로 바꾸세요. https://를 사용해야 합니다).
5. 여기 웹훅 주소를 입력하세요(woo의 경우 대략 `https://example.com/?wc-api=dv_gateway` 형태).
6. Events: 요청 시, 이 웹훅이 수신해야 할 이벤트를 선택합니다. 다음과 같은 결제 관련 이벤트를 모두 활성화하세요:
   1. Confirmed payment
   2. Unconfirmed payment (예: 고객이 BTC로 결제를 전송하는 경우)
   3. Processing withdrawal (현재 이 통합에서는 지원되지 않음)
7. DV.net 대시보드에서 웹훅을 저장하고 활성화합니다.

## 6단계: 준비 완료! (테스트를 잊지 마세요)

축하합니다! 이제 DV.net 결제 게이트웨이가 WooCommerce 스토어에 완전히 통합되었습니다.

마지막으로 실제 테스트를 진행하세요. 가장 좋은 방법은 다음과 같습니다:
1. 고객처럼 스토어에 접속합니다.
2. 실제 상품을 장바구니에 담습니다.
3. 체크아웃 페이지로 이동합니다.
4. "Pay with Crypto via DV.net"(또는 설정한 제목)을 선택합니다.
5. 주문을 진행하고 DV.net 결제 페이지로 올바르게 리디렉션되는지 확인합니다.
6. 소액의 테스트 결제를 완료하여 결제가 성공한 후 WooCommerce Orders 섹션의 주문 상태가 "Pending payment"에서 "Processing" 또는 "Completed"로 자동 업데이트되는지 확인하는 것을 강력히 권장합니다.

주문 상태가 자동으로 업데이트된다면 통합이 성공적으로 완료된 것입니다!