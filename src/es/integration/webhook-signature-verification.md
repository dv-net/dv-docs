# Verificación de la firma de webhooks

- En la configuración del comerciante encontrarás la "Secret key for verification". Se utiliza para verificar la autenticidad de los webhooks entrantes.

![creatingDepositWallets.png](../../assets/images/integration/creating-deposit-wallets/creatingDepositWallets.png)


- Ejemplo de validación en PHP:

  ```php
  <?php
  $secretKeyStored = 'tu secret key';

  $signFromRequest = $_SERVER['HTTP_X_SIGN'];
  $json = file_get_contents('php://input');

  $signCalculated = hash('sha256', $json . $secretKeyStored);

  var_dump(hash_equals($signFromRequest, $signCalculated));
  ?>
  ```