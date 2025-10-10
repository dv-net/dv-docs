# 웹훅 서명 확인

- 판매자 설정에서 Secret key for verification(확인 비밀 키)을 찾을 수 있습니다. 이 키는 들어오는 웹훅의 진위 여부를 확인하는 데 사용됩니다.

![creatingDepositWallets.png](../../assets/images/integration/creating-deposit-wallets/creatingDepositWallets.png)


- PHP 유효성 검사 예시:

```php
<?php
$secretKeyStored = '귀하의 비밀 키';

$signFromRequest = $_SERVER['HTTP_X_SIGN'];
$json = file_get_contents('php://input');

$signCalculated = hash('sha256', $json . $secretKeyStored);

var_dump(hash_equals($signFromRequest, $signCalculated));