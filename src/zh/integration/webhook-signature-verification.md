# 验证 Webhook 签名

- 在商户设置中，您将找到“Secret key for verification”（用于验证的密钥）。它用于验证传入 Webhook 的真实性。

- PHP 验证示例：

  ```php
  <?php
  $secretKeyStored = '您的密钥';

  $signFromRequest = $_SERVER['HTTP_X_SIGN'];
  $json = file_get_contents('php://input');

  $signCalculated = hash('sha256', $json . $secretKeyStored);

  var_dump(hash_equals($signFromRequest, $signCalculated));
  ?>
  ```