# Проверка подписи веб-хуков

- В настройках мерчанта вы найдёте Secret key for verification (как на скриншоте). Он используется для проверки подлинности входящих вебхуков.
 

![creatingDepositWallets.png](../../assets/images/integration/creating-deposit-wallets/creatingDepositWallets.png)


- Пример валидации на PHP:

  ```php
  <?php
  $secretKeyStored = 'ваш secret key';

  $signFromRequest = $_SERVER['HTTP_X_SIGN'];
  $json = file_get_contents('php://input');

  $signCalculated = hash('sha256', $json . $secretKeyStored);

  var_dump(hash_equals($signFromRequest, $signCalculated));