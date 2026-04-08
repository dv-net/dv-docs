# Экспорт приватных ключей

Приватный ключ даёт прямой доступ к средствам на конкретном адресе. DV.net позволяет экспортировать ключи как для отдельного адреса, так и для нескольких сразу.

> ⚠️ **Приватный ключ — это полный доступ к кошельку.** Никогда не передавайте его третьим лицам, не отправляйте по электронной почте или мессенджерам. Удаляйте файл с устройства после использования.

## Экспорт ключа одного адреса

1. Перейдите в **Transfers → Hot Wallets**
2. При необходимости отключите фильтр **Hide addresses with low balance**
3. Найдите нужный адрес через строку поиска
4. Поставьте галочку рядом с нужным адресом (чекбокс слева)
5. Нажмите кнопку **Download keys** в правом верхнем углу таблицы
6. Выберите формат: **JSON** или **CSV**
7. Пройдите двухфакторную аутентификацию
8. Сохраните файл в надёжном месте

<a href="../../assets/images/onboarding/export-keys/keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Экспорт одного ключа</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Экспорт одного ключа\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## Массовый экспорт ключей

1. Перейдите в **Transfers → Hot Wallets**
2. При необходимости отключите фильтр **Hide addresses with low balance**
3. Отметьте нужные адреса чекбоксами слева от каждой карточки
   - **Select all on page** — выбрать все адреса на текущей странице
   - **Select all (N)** — выбрать все адреса во всех страницах
4. Нажмите кнопку **Download keys** в верхней части списка
5. Выберите формат: **JSON** или **CSV**
6. Пройдите двухфакторную аутентификацию
7. Сохраните файл в надёжном месте

<a href="../../assets/images/onboarding/export-keys/mass-keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Массовый экспорт ключей</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Массовый экспорт ключей\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/mass-keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## Форматы файлов

### JSON
Удобен для программной обработки. Файл содержит список сетей, а внутри каждой сети — массив адресов с публичным ключом, приватным ключом и адресом:
```json
{
  "entries": [
    {
      "name": "BLOCKCHAIN_ETHEREUM",
      "items": [
        {
          "public_key": "04...e68",
          "private_key": "0x...fb5",
          "address": "0x...2b26" 
        }
      ]
    }
  ]
}
```

### CSV
Удобен для просмотра в Excel или Google Sheets. Каждая строка содержит сеть, публичный ключ, приватный ключ и адрес:
```
blockchain,public_key,private_key,address
BLOCKCHAIN_ETHEREUM,04...e68,0x...fb5,0x...2b26
```

## После экспорта

- Храните файл на зашифрованном диске или офлайн-устройстве
- После завершения операции удалите файл с рабочего устройства
- Если ключ импортировался в сторонний кошелёк — удалите импортированный кошелёк по завершении работы
- Если вы подозреваете, что ключ был скомпрометирован — прекратите использование этого адреса для приёма платежей

