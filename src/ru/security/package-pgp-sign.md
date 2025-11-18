# Верификация пакетов и установленного программного обеспечения


## Проверка подлинности наших пакетов с помощью GPG

Все наши пакеты `.deb` и `.rpm` и  чексуммы подписаны криптографической подписью с использованием ключей GPG. Это 
гарантирует, что пакеты, которые вы загружаете, были созданы нами и не были изменены или повреждены третьими лицами. 
Вы можете легко проверить подлинность пакета, используя наш публичный ключ.

Весь исходный код проекта, соответствующие скомпилированные исполняемые файлы, а так же пакеты `.deb` и `.rpm` публикуются 
в релизах github.com. Соответствующие им подписи расположены там же в файлах `.sig`

Пример: https://github.com/dv-net/dv-merchant/releases/tag/v0.9.4


<a href="../../assets/images/security/github-signed-assets.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Подписанные ресурсы GitHub</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Подписанные ресурсы GitHub\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/security/github-signed-assets.png" alt="Подписанные ресурсы GitHub" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

-----

### Шаг 1: Импортируйте наш публичный GPG ключ

Прежде всего, вам необходимо импортировать наш публичный ключ в вашу связку ключей. Это нужно сделать только один раз. 
Наш ключ опубликован по адресу https://dv.net/gpg.pub 

Сохраните публичный ключ к себе на сервер: 

```
curl https://dv.net/gpg.pub -o dv-net.asc
```

Импортируйте в связку ключей:

```bash
gpg --import dv-net.asc
```

-----

### Шаг 2: Проверьте подпись пакета

После импорта ключа вы можете проверить подпись любого загруженного вами пакета.

#### Для пакетов .deb (Debian/Ubuntu)

Для проверки `.deb` пакета используйте команду `dpkg-sig`. Если она не установлена, вы можете установить ее с помощью 
`sudo apt-get install dpkg-sig`.

```bash
dpkg-sig --verify имя_пакета.deb
```

Если подпись действительна, вы увидите в выводе статус **GOODSIG** от доверенного ключа.

#### Для пакетов .rpm (Fedora/CentOS/RHEL)

Для проверки `.rpm` пакета используйте команду `rpm`.

```bash
rpm --checksig имя_пакета.rpm
```

Если подпись верна, в выводе команды вы увидите, что все проверки (включая `gpg`) пройдены успешно (`OK`).

Выполнение этих простых шагов поможет вам убедиться в целостности и подлинности наших программных пакетов.