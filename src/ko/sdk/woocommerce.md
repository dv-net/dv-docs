# DV.net WooCommerce 플러그인으로 워드프레스에서 암호화폐 결제 받기

전자상거래 스토어에 암호화폐 결제 게이트웨이를 통합하면 고객층을 넓히고 현대적이고 안전한 결제 옵션을 제공할 수 있습니다. DV.net은 이러한 거래를 처리하기 위한 강력한 솔루션을 제공하며, 전용 WooCommerce 플러그인을 통해 통합 과정을 간편하게 해줍니다.
이 가이드는 워드프레스 사이트에 DV.net WooCommerce 플러그인을 설치하고 설정하는 과정을 단계별로 안내합니다.

## 사전 준비 사항:

- 활성화된 워드프레스 웹사이트
- WooCommerce 플러그인이 설치 및 활성화됨
- 활성화된 DV.net 계정

## 1단계: DV.net WooCommerce 플러그인 받기

첫 단계로 플러그인 파일을 다운로드합니다. 공식 워드프레스 저장소의 플러그인과 달리, 이 플러그인은 DV.net GitHub 페이지에서 받습니다.

DV.net WooCommerce 플러그인 공식 저장소로 이동: https://github.com/dv-net/dv-woocommerce (귀하의 파일에서 제공됨)
- 오른쪽 메뉴에서 Releases 섹션을 클릭합니다.
- 마지막 버전의 메뉴에서 "Source code (zip)"를 선택합니다.
- .zip 파일을 컴퓨터에 저장합니다. 압축은 풀지 마세요.

## 2단계: 워드프레스 사이트에 플러그인 설치

이제 다운로드한 ZIP 파일을 워드프레스 관리자 대시보드에 업로드합니다.
1. 워드프레스 관리자 영역에 로그인합니다(예: yourdomain.com/wp-admin).
2. 왼쪽 메뉴에서 Plugins > Add New로 이동합니다.
3. "Add Plugins" 페이지 상단에서 Upload Plugin 버튼을 클릭합니다.
4. "Choose File" 버튼을 클릭하고 방금 다운로드한 dv-woocommerce-main.zip 파일을 선택합니다.
5. Install Now를 클릭합니다.
6. 워드프레스가 플러그인 설치를 마치면 Activate Plugin 버튼을 클릭합니다.
이제 활성 플러그인 목록에 "DV.net WooCommerce Plugin"이 표시됩니다.

## 3단계: DV.net API 자격 증명 받기

플러그인이 작동하려면 API 키를 사용해 DV.net 계정과 연결해야 합니다.

1. DV.net 계정 대시보드에 로그인합니다.
2. API Keys 섹션으로 이동합니다(obtaining-api-key-and-secret.md 파일 기준).
3. "Create New Key" 버튼을 클릭합니다.
4. 키에 알기 쉬운 이름을 지정합니다(예: "WooCommerce Store").
5. 시스템이 API Key와 API Secret을 생성합니다.
6. 중요: API Key와 API Secret을 모두 복사하여 비밀번호 관리자 같은 안전한 곳에 저장하세요. 이 페이지를 떠난 후에는 Secret을 다시 확인할 수 없습니다.
7. 또한 API URL을 기록해 두세요. 이는 귀하의 DV.net 인스턴스의 기본 URL입니다(예: https://api.your-dv-instance.com).

## 4단계: WooCommerce에서 DV.net 게이트웨이 설정

API 키를 준비했으면 이제 WooCommerce 내에서 플러그인 설정을 구성합니다.

1. 워드프레스 대시보드에서 WooCommerce > Settings로 이동합니다.
2. 상단의 Payments 탭을 클릭합니다.
3. 결제 방법 목록에서 "DV.net"을 확인하고 오른쪽의 Manage 버튼을 클릭합니다.
4. DV.net 설정 페이지가 열립니다. 다음 항목을 입력합니다(class-dv-gateway.php 파일에서 확인).
   1. Enable/Disable: 결제 수단을 체크아웃에 표시하려면 "Enable DV.net" 체크박스를 선택합니다.
   2. Title: 고객이 결제 방법을 선택할 때 보이는 텍스트입니다. 예: "Pay with Crypto via DV.net".
   3. Description: 제목 아래에 표시되는 짧은 설명입니다. 예: "Securely pay with cryptocurrency."
   4. API URL: 3단계에서 기록한 API URL을 붙여넣습니다.
   5. API Key: 3단계에서 생성한 API Key를 붙여넣습니다.
   6. API Secret: 3단계에서 저장한 API Secret을 붙여넣습니다.
   7. Webhook Secret: 보안을 위해 매우 중요한 필드입니다. 강력하고 고유한 비밀 구문을 생성해야 합니다(예: 비밀번호 생성기 사용). DV.net과 상점이 공유하는 비밀번호라고 생각하세요. 이 비밀은 다음 단계에서 필요하므로 안전하게 보관하세요.
5. 페이지 하단의 Save changes 버튼을 클릭합니다.

## 5단계: DV.net 계정에서 웹후크 설정

이제 상점이 DV.net으로 결제 요청을 전송하도록 설정되었습니다. 마지막 단계는 DV.net이 결제 상태 업데이트("Paid" 또는 "Failed" 등)를 상점으로 다시 보낼 수 있도록 웹후크를 설정하는 것입니다.

1. DV.net 계정 대시보드로 돌아갑니다.
2. Webhooks 또는 Developer 섹션으로 이동합니다.
3. 새 웹후크를 생성합니다.
4. Payload URL: 가장 중요한 부분입니다. 상점의 고유 웹후크 URL은 다음과 같습니다: https://yourdomain.com/wc-api/dv_gateway/ (yourdomain.com을 실제 웹사이트 주소로 바꾸세요. https://를 사용해야 합니다).
5. Secret: 4단계에서 생성해 저장한 Webhook Secret과 정확히 동일한 값을 붙여넣습니다. 이는 들어오는 요청이 실제로 DV.net에서 온 것인지 확인하는 데 사용됩니다(webhook-signature-verification.md에 언급됨).
6. Events: 요청 시, 이 웹후크가 수신해야 하는 이벤트를 선택합니다. 다음과 같은 결제 관련 모든 이벤트를 활성화해야 합니다.
   1. payment.completed
   2. payment.failed
   3. invoice.paid (참고: 정확한 이벤트 이름은 다를 수 있습니다. 결제 상태 변경과 관련된 모든 항목을 선택하세요.)
7. DV.net 대시보드에서 웹후크를 저장하고 활성화합니다.

Step 6: 모두 설정 완료! (테스트를 잊지 마세요)

축하합니다! 이제 DV.net 결제 게이트웨이가 WooCommerce 스토어에 완전히 통합되었습니다.

마지막으로 라이브 테스트를 진행하세요. 가장 좋은 방법은 다음과 같습니다.
1. 고객처럼 스토어에 방문합니다.
2. 실제 상품을 장바구니에 담습니다.
3. 체크아웃 페이지로 이동합니다.
4. "Pay with Crypto via DV.net"(또는 설정한 제목)을 선택합니다.
5. 주문을 진행하고 DV.net 결제 페이지로 올바르게 리디렉션되는지 확인합니다.
6. 결제가 성공한 후 WooCommerce Orders 섹션의 주문 상태가 "Pending payment"에서 "Processing" 또는 "Completed"로 자동 업데이트되는지 확인하기 위해 소액 테스트 거래를 완료하는 것을 강력히 권장합니다.

주문 상태가 자동으로 업데이트된다면 통합이 성공적으로 완료된 것입니다!