# Checking the signature of webhooks

- In the merchant settings you will find Secret key for verification. It is used to verify the authenticity of incoming webhooks.

- PHP validation example:

```php
<?php
$secretKeyStored = 'your secret key';

$signFromRequest = $_SERVER['HTTP_X_SIGN'];
$json = file_get_contents('php://input');

$signCalculated = hash('sha256', $json . $secretKeyStored);

var_dump(hash_equals($signFromRequest, $signCalculated));