# 충전을 위한 지갑 생성

- 판매자 설정 섹션에서 API 키(`x-api-key`)를 얻으십시오("Your API key" 스크린샷과 같이).
- 헤더에 이 키를 지정하여 API에 요청을 보냅니다. cURL 예시:

  ```bash
  curl -X POST \
    'https://{your_domain or subdomain}/api/v1/external/wallet' \
    -H 'Content-Type: application/json' \
    -H 'x-api-key: {Your_API_key}' \
    --data '{
      "amount": 20,
      "store_external_id": "귀하의_상점의_사용자_ID"
  }'

- 성공적인 응답 후 시스템은 결제 링크(`pay_url`)가 포함된 JSON 데이터를 반환하며, 사용자를 이 링크로 리디렉션해야 합니다.

<!-- end list -->
