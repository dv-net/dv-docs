# Actualización y verificación de dv.net

Actualizar `dv.net` es sencillo y seguro utilizando los gestores de paquetes estándar de tu sistema operativo, como `apt`, `yum` o `dnf`.

## Verificación automática de actualizaciones

Con cada actualización, tu gestor de paquetes **verifica automáticamente la
autenticidad** de los paquetes. Esto se hace utilizando nuestra clave pública GPG,
que garantiza que recibes software genuino y sin modificar. No necesitas realizar
ninguna acción manual para comprobar la firma --- `apt`, `yum` y `dnf` se encargan
de ello por ti.

Nuestra clave pública está disponible en: <https://dv.net/gpg.pub>

------------------------------------------------------------------------

## Visualización y verificación del historial de actualizaciones

Puedes revisar fácilmente el historial de todas las actualizaciones instaladas y
garantizar su integridad.

### Para Debian / Ubuntu (usando `apt`)

El historial de actualizaciones se guarda en archivos de registro. Puedes verlos con el
siguiente comando:

``` bash
grep "upgrade dv.net" /var/log/dpkg.log
```

O para un historial de `apt` más detallado:

``` bash
grep "dv.net" /var/log/apt/history.log
```

Estos registros muestran qué versiones del paquete `dv.net` se instalaron y cuándo. Como
`apt` verifica las firmas GPG antes de la instalación, una entrada en el registro confirma
una actualización correcta.

### Para CentOS / RHEL (usando `yum`)

`yum` ofrece una manera práctica de ver el historial de transacciones.

``` bash
yum history list dv.net
```

Para obtener información detallada sobre una actualización específica de la lista, usa:

``` bash
yum history info <transaction_ID>
```

Este comando mostrará los detalles de la transacción, incluida la información de verificación
de la clave GPG.

### Para Fedora y versiones más recientes de CentOS / RHEL (usando `dnf`)

`dnf` utiliza la misma sintaxis que `yum` para la gestión del historial.

``` bash
dnf history list dv.net
```

Para obtener información detallada sobre una actualización específica:

``` bash
dnf history info <transaction_ID>
```

Al igual que `yum`, `dnf` mostrará la información completa de la transacción, confirmando
que el paquete superó las comprobaciones de autenticidad antes de la instalación.

## Verificación de paquetes descargados directamente

Incluso después de que un paquete esté instalado, puedes comprobar su integridad y
autenticidad. Todos los paquetes descargados se almacenan temporalmente en la caché
del gestor de paquetes, donde pueden verificarse manualmente. Esto es útil para
auditorías de seguridad o para confirmar que un archivo instalado anteriormente no
se haya corrompido.

## Para Debian / Ubuntu

De forma predeterminada, `APT` elimina los archivos `.deb` tras una instalación correcta. Para
hacer que `APT` conserve siempre los paquetes descargados en la caché, crea un archivo de
configuración:

``` bash
echo 'APT::Keep-Downloaded-Packages "true";' | sudo tee /etc/apt/apt.conf.d/01keep-debs
```

Todos los paquetes descargados se almacenarán en `/var/cache/apt/archives/`.

### Método 1: Verificación de firma GPG (recomendado)

La forma más fiable es comprobar la firma GPG del paquete. Esto confirma que el paquete fue
creado por nosotros y no ha sido alterado.

``` bash
# Install the utility if missing
sudo apt-get install dpkg-sig

# Verify the signature of a specific package
dpkg-sig --verify /var/cache/apt/archives/dv-updater_*.deb
```

Si la comprobación es satisfactoria, verás el estado **GOODSIG**,
lo que indica autenticidad. ✅

### Método 2: Verificación de suma de comprobación

También puedes comprobar la integridad del archivo comparando su suma de comprobación con la
que figura en los metadatos del repositorio.

1.  **Comprueba la suma de comprobación oficial** del paquete usando `apt-cache`:

    ``` bash
    apt-cache show dv-updater
    ```

    En la salida, busca la línea **SHA256**:

        Package: dv-updater
        Version: 0.0.11~RC01-nightly-20250717T220501Z
        Architecture: amd64
        Maintainer: dv-updater
        Installed-Size: 14500
        Filename: pool/main/d/dv-updater/dv-updater_0.0.11~RC01-nightly-20250717T220501Z_amd64.deb
        Size: 6025526
        SHA256: 2c60a10e0a55fb22903497280f78ab66e463e10a11b250c3147eb5672cd929bb
        Description: no description given

2.  **Calcula la suma de comprobación** del archivo descargado:

    ``` bash
    sha256sum /var/cache/apt/archives/dv-updater_0.0.11~RC01-nightly-20250717T220501Z_amd64.deb
    ```

3.  **Compara los resultados.** El valor hash debe coincidir exactamente con el
    de `apt-cache show`.

------------------------------------------------------------------------

## Para CentOS / RHEL / Fedora

Los gestores de paquetes `dnf` y `yum` guardan por defecto los paquetes descargados en
la caché. Suelen ubicarse en un subdirectorio dentro de `/var/cache/dnf/`.

### Método 1: Verificación de firma GPG (recomendado)

Utiliza la utilidad estándar `rpm` para comprobar la firma de un archivo `.rpm` descargado.
Este es el método más adecuado y fiable.

``` bash
# Locate the package in the cache and verify it
rpm --checksig /var/cache/dnf/dvnet-*/packages/*.rpm
```

*Nota: la ruta puede diferir ligeramente según la versión de tu sistema.
El `*` ayuda a localizar automáticamente el directorio correcto.*

Si la firma es válida, la salida del comando para cada paquete comprobado contendrá
`digests signatures OK`.

### Método 2: Verificación de suma de comprobación

Este método verifica la integridad del archivo, pero no su autenticidad.

1.  **Obtén la suma de comprobación oficial** del paquete desde el repositorio:

    ``` bash
    dnf repoquery --info dv-processing
    ```

    O para `yum`:

    ``` bash
    repoquery --info dv-processing
    ```

    En la salida, busca la línea **Checksum**:

        Name         : dv-processing
        Version      : 0.6.6
        ...
        Checksum Type: sha256
        Checksum     : f019a9564433cacf7a1c307e9a358e43cb9a3325abcdef1234567890abcdef
        ...

2.  **Calcula la suma de comprobación** del archivo en caché:

    ``` bash
    sha256sum /var/cache/dnf/dvnet-*/packages/dv-processing_0.6.6_linux_amd64.rpm
    ```

3.  **Compara ambos valores.** Deben ser idénticos.