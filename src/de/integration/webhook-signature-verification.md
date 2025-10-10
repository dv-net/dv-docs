# Überprüfung der Webhook-Signatur

- In den Merchant-Einstellungen finden Sie einen geheimen Schlüssel zur Verifizierung ("Secret key for verification"). Dieser wird verwendet, um die Authentizität eingehender Webhooks zu überprüfen.

![creatingDepositWallets.png](../../assets/images/integration/creating-deposit-wallets/creatingDepositWallets.png)


- Beispiel für die Validierung in PHP:

  ```php
  <?php
  $secretKeyStored = 'ihr geheimer Schlüssel';

  $signFromRequest = $_SERVER['HTTP_X_SIGN'];
  $json = file_get_contents('php://input');

  $signCalculated = hash('sha256', $json . $secretKeyStored);

  var_dump(hash_equals($signFromRequest, $signCalculated));
  ?>
  ```