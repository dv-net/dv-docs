# DV.net Payment Gateway 확장 기능으로 OpenCart에서 암호화폐 결제를 받는 방법

암호화폐 결제를 제공하면 OpenCart 스토어의 매력을 높이고 더 폭넓은 고객층을 유치하며 현대적인 결제 유연성을 제공할 수 있습니다. DV.net은 강력한 암호화폐 결제 처리 솔루션을 제공하며, OpenCart 확장 기능을 통해 통합 과정을 간소화합니다.
이 가이드는 OpenCart 웹사이트에 DV.net 결제 게이트웨이 확장 기능을 설치하고 구성하는 단계별 안내를 제공합니다.

## 사전 준비 사항:

- 활성화된 OpenCart 웹사이트
- OpenCart 대시보드 관리자 권한
- 활성화된 DV.net 계정

## 1단계: DV.net OpenCart 확장 기능 받기

먼저 확장 기능 파일을 다운로드해야 합니다. 공식 DV.net GitHub 저장소에서 받을 수 있습니다.

- 공식 DV.net OpenCart 확장 저장소로 이동: https://github.com/dv-net/dv-opencart
- Releases 페이지로 이동
- `dv-opencart-vX.X.X.ocmod.zip` 다운로드

## 2단계: OpenCart 사이트에 확장 기능 설치

OpenCart는 Extension Installer로 업로드를 처리합니다.

- OpenCart 관리자 대시보드에 로그인합니다(예: yourdomain.com/admin).
- 왼쪽 메뉴에서 Extensions > Installer로 이동합니다.
- Upload 버튼을 클릭합니다.
- 1단계에서 다운로드한 .zip 파일을 선택합니다.
- 업로드 및 설치가 완료될 때까지 기다립니다. 성공 메시지가 표시되어야 합니다.
- 중요: 설치 후 Extensions > Modifications로 이동하여 오른쪽 상단의 파란색 Refresh 버튼을 클릭해 변경 사항이 시스템에 반영되도록 합니다.
- 테마 캐시를 비우는 것도 좋습니다. Dashboard에서 오른쪽 상단의 파란색 Settings 톱니바퀴 아이콘을 클릭한 다음, Theme Cache와 SASS Cache의 Refresh 버튼을 클릭합니다.

## 3단계: DV.net API 자격 증명 받기

스토어를 DV.net에 연결하려면 API Key, API Secret, API URL이 필요합니다.

- DV.net 계정 대시보드에 로그인합니다.
- API Keys 섹션으로 이동합니다(문서 파일의 obtaining-api-key-and-secret.md를 참고).
- "Create New Key"를 클릭합니다.
- 키에 적절한 이름을 지정합니다(예: "OpenCart Store").
- 시스템이 API Key와 API Secret을 표시합니다.
- 중요: API Key와 API Secret을 즉시 복사하여 안전한 곳(예: 비밀번호 관리자)에 보관하세요. Secret은 다시 표시되지 않습니다.
- API URL을 기록해 둡니다. 이는 DV.net 인스턴스의 기본 URL입니다(예: https://api.your-dv-instance.com).

## 4단계: OpenCart에서 DV.net 게이트웨이 구성

이제 OpenCart 관리자 패널에서 결제 방법을 구성합니다.

- OpenCart 대시보드에서 Extensions > Extensions로 이동합니다.
- "Choose the extension type" 드롭다운에서 Payments를 선택합니다.
- 목록에서 "DV.net Gateway"를 찾을 때까지 스크롤합니다. 아직 설치되지 않았다면 초록색 Install (+) 버튼을 클릭한 뒤, 파란색 Edit(연필) 버튼을 클릭합니다.
- DV.net 구성 페이지가 열립니다. 다음 항목을 입력합니다(admin/controller/extension/payment/dv_gateway.php 및 관련 language/template 파일 기준):
- API URL: 3단계에서의 API URL을 붙여넣습니다.
- API Key: 3단계에서의 API Key를 붙여넣습니다.
- API Secret: 3단계에서의 API Secret을 붙여넣습니다.

## 5단계: 통합 테스트!

- 이제 DV.net OpenCart 통합이 완료되었습니다! 테스트 거래를 수행하는 것이 중요합니다.
- OpenCart 스토어의 프런트엔드로 이동합니다.
- 상품을 장바구니에 담습니다.
- 체크아웃 과정을 진행합니다.
- 결제 방법 선택 시 "DV.net Gateway"(또는 구성된 제목, OpenCart 확장에서는 고정된 경우가 많음)를 선택합니다.
- 주문을 확인합니다. DV.net 결제 페이지로 리디렉션되어야 합니다.
- 강력 권장: 소액의 실제 거래를 완료해 보세요. DV.net에서 결제가 성공한 후 OpenCart 관리자 패널 > Sales > Orders로 돌아갑니다. 테스트 주문의 상태가 'Pending'에서 'Paid' 상태(예: 'Processing' 또는 'Complete')로 자동 업데이트되었는지 확인합니다.
주문 상태가 별도의 수동 조치 없이 올바르게 업데이트된다면 설정이 성공적으로 완료된 것입니다! 이제 고객은 DV.net을 통해 귀하의 OpenCart 스토어에서 암호화폐로 결제할 수 있습니다.