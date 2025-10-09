# Verificación de paquetes y software instalado

## Verificación de la autenticidad de nuestros paquetes con GPG

Todos nuestros paquetes `.deb` y `.rpm` y sus sumas de verificación están firmados criptográficamente usando claves GPG. Esto garantiza que los paquetes que descargas fueron creados por nosotros y no han sido alterados ni corrompidos por terceros. Puedes verificar fácilmente la autenticidad de un paquete usando nuestra clave pública.

Todo el código fuente del proyecto, los ejecutables compilados correspondientes, así como los paquetes `.deb` y `.rpm` se publican en las releases de github.com. Sus firmas correspondientes también se encuentran allí, en archivos `.sig`.

Ejemplo: https://github.com/dv-net/dv-merchant/releases/tag/v0.9.4

![github-signed-assets.png](../../assets/images/security/github-signed-assets.png)

-----

### Paso 1: Importar nuestra clave pública GPG

Primero, necesitas importar nuestra clave pública en tu llavero de claves. Esto solo debe hacerse una vez. Nuestra clave está publicada en [https://dv.net/gpg.pub](https://dv.net/gpg.pub)

Guarda la clave pública en tu servidor:

```bash
curl https://dv.net/gpg.pub -o dv-net.asc
```

Luego, impórtala en tu llavero:

```bash
gpg --import dv-net.asc
```

-----

### Paso 2: Verificar la firma del paquete

Después de importar la clave, puedes verificar la firma de cualquier paquete que hayas descargado.

#### Para paquetes .deb (Debian/Ubuntu)

Para verificar un paquete `.deb`, usa el comando `dpkg-sig`. Si no está instalado, puedes instalarlo con 
`sudo apt-get install dpkg-sig`.

```bash
dpkg-sig --verify package_name.deb
```

Si la firma es válida, verás un estado **GOODSIG** de una clave de confianza en la salida.

#### Para paquetes .rpm (Fedora/CentOS/RHEL)

Para verificar un paquete `.rpm`, usa el comando `rpm`.

```bash
rpm --checksig package_name.rpm
```

Si la firma es correcta, la salida del comando mostrará que todas las comprobaciones (incluida `gpg`) han pasado 
correctamente (`OK`).

Seguir estos sencillos pasos te ayudará a garantizar la integridad y autenticidad de nuestros paquetes de software.