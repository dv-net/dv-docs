# Binance

### Настройка кошелька Binance для автоматического вывода с биржи

Войдите в свой профиль на бирже и перейдите в раздел «Settings» (Настройки).

![bin1.png](../../assets/images/exchanges/binance/bin1.png)

В настройках откройте раздел «Security» (Безопасность).

![bin2.png](../../assets/images/exchanges/binance/bin2.png)

Перейдите на вкладку «Withdrawal Whitelist» (Список разрешённых для вывода).

![bin3.png](../../assets/images/exchanges/binance/bin3.png)

Нажмите кнопку «Add Address» (Добавить адрес).

![bin4.png](../../assets/images/exchanges/binance/bin4.png)

Введите имя кошелька, выберите сеть и убедитесь, что установлен флажок «Add Adress to Whitelist» (Добавить адрес в белый список). Нажмите «Save» (Сохранить) и пройдите проверку безопасности.

![bin5.png](../../assets/images/exchanges/binance/bin5.png)

### Подключение API-ключа

Войдите в свою учетную запись на бирже, нажмите на значок профиля и выберите «Settings» (Настройки).

![bin11.png](../../assets/images/exchanges/binance/bin11.png)

В разделе «Settings» (Настройки) найдите и раскройте пункт «Account» (Учетная запись). Перейдите в подраздел «API Management» (Управление API).

![bin12.png](../../assets/images/exchanges/binance/bin12.png)

Обязательно снимите галочку с пункта «By checking this box, all existing API Key(s) on your master account and sub-accounts will be subject to Default Security Controls» (Установив этот флажок, вы примените стандартные меры безопасности ко всем существующим API-ключам в вашей основной учётной записи и подучётных записях) перед созданием API-ключа. После этого нажмите кнопку «Create API» (Создать API).​

![bin13.png](../../assets/images/exchanges/binance/bin13.png)

Для упрощения выберите вариант «System-generated API Key» (Сгенерированный ключ) и нажмите «Next» (Далее).

![bin14.png](../../assets/images/exchanges/binance/bin14.png)

Присвойте вашему ключу понятное имя.

![bin15.png](../../assets/images/exchanges/binance/bin15.png)

Пройдите проверку безопасности.

![bin16.png](../../assets/images/exchanges/binance/bin16.png)

После создания API-ключа установите необходимые права доступа и добавьте IP-адрес вашего мерчанта (полученный на нашей платформе во время настройки) в поле:

«Restrict access to trusted IPs only (recommended)» (Ограничить доступ только доверенными IP-адресами)

Этот параметр обязателен для интеграции с Binance.

![bin17.png](../../assets/images/exchanges/binance/bin17.png)

Сохраните полученные «API Key» (API-ключ) и «Secret Key» (Секретный ключ) и вставьте их в соответствующие поля для подключения биржи. Затем нажмите кнопку «Connect the Exchange» (Подключить биржу).

![bin18.png](../../assets/images/exchanges/binance/bin18.png)
