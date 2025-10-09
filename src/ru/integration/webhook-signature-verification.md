# Проверка подписи веб-хуков

- В настройках мерчанта вы найдёте Secret key for verification. Он используется для проверки подлинности входящих вебхуков.

- Пример валидации на PHP:

  ```php
  <?php
  $secretKeyStored = 'ваш secret key';

  $signFromRequest = $_SERVER['HTTP_X_SIGN'];
  $json = file_get_contents('php://input');

  $signCalculated = hash('sha256', $json . $secretKeyStored);

  var_dump(hash_equals($signFromRequest, $signCalculated));