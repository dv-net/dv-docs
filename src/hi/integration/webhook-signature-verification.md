# वेबहुक हस्ताक्षर का सत्यापन

- व्यापारी सेटिंग्स में, आपको "Secret key for verification" मिलेगा। इसका उपयोग आने वाले वेबहुक की प्रामाणिकता को सत्यापित करने के लिए किया जाता है।

![creatingDepositWallets.png](../../assets/images/integration/creating-deposit-wallets/creatingDepositWallets.png)


- PHP में सत्यापन का उदाहरण:

  ```php
  <?php
  $secretKeyStored = 'आपकी गुप्त कुंजी';

  $signFromRequest = $_SERVER['HTTP_X_SIGN'];
  $json = file_get_contents('php://input');

  $signCalculated = hash('sha256', $json . $secretKeyStored);

  var_dump(hash_equals($signFromRequest, $signCalculated));
  ?>
  ```