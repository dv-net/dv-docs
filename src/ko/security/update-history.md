# dv.net 업데이트 및 검증

운영 체제의 표준 패키지 관리자(`apt`, `yum`, `dnf` 등)를 사용하면 `dv.net`을 간단하고 안전하게 업데이트할 수 있습니다.

## 자동 업데이트 검증

모든 업데이트 시 패키지 관리자는 패키지의 진위를 자동으로 검증합니다. 이는 당사의 공개 GPG 키를 사용하여 이루어지며, 사용자가 진품의 변경되지 않은 소프트웨어를 받았음을 보장합니다. 서명 확인을 위해 별도의 수동 작업을 할 필요가 없습니다 — `apt`, `yum`, `dnf`가 이를 처리합니다.

당사의 공개 키는 다음에서 확인할 수 있습니다: <https://dv.net/gpg.pub>

------------------------------------------------------------------------

## 업데이트 이력 보기 및 확인

설치된 모든 업데이트의 이력을 쉽게 검토하고 무결성을 확인할 수 있습니다.

### Debian / Ubuntu(`apt` 사용)

업데이트 이력은 로그 파일에 저장됩니다. 다음 명령으로 확인할 수 있습니다:

``` bash
grep "upgrade dv.net" /var/log/dpkg.log
```

보다 자세한 `apt` 이력을 보려면:

``` bash
grep "dv.net" /var/log/apt/history.log
```

이 로그에는 `dv.net` 패키지가 어떤 버전으로 언제 설치되었는지가 표시됩니다. `apt`는 설치 전에 GPG 서명을 검증하므로, 로그에 기록이 있다는 것은 업데이트가 성공적으로 완료되었음을 의미합니다.

### CentOS / RHEL(`yum` 사용)

`yum`은 트랜잭션 이력을 확인하는 편리한 방법을 제공합니다.

``` bash
yum history list dv.net
```

목록에서 특정 업데이트에 대한 자세한 정보를 보려면:

``` bash
yum history info <transaction_ID>
```

이 명령은 GPG 키 검증 정보를 포함한 트랜잭션 세부 정보를 표시합니다.

### Fedora 및 최신 CentOS / RHEL(`dnf` 사용)

`dnf`는 이력 관리에 대해 `yum`과 동일한 구문을 사용합니다.

``` bash
dnf history list dv.net
```

특정 업데이트에 대한 자세한 정보를 보려면:

``` bash
dnf history info <transaction_ID>
```

`yum`과 마찬가지로 `dnf`는 전체 트랜잭션 정보를 보여 주며, 설치 전에 패키지가 진위 검사를 통과했음을 확인합니다.

## 직접 다운로드한 패키지 검증

패키지를 설치한 후에도 무결성과 진위를 확인할 수 있습니다. 모든 다운로드된 패키지는 패키지 관리자의 캐시에 일시 저장되며, 여기서 수동으로 검증할 수 있습니다. 이는 보안 감사나 이전에 설치된 파일이 손상되지 않았는지 확인할 때 유용합니다.

## Debian / Ubuntu용

기본적으로 `APT`는 설치가 성공하면 `.deb` 파일을 삭제합니다. 다운로드한 패키지를 항상 캐시에 보관하도록 하려면 구성 파일을 생성하세요:

``` bash
echo 'APT::Keep-Downloaded-Packages "true";' | sudo tee /etc/apt/apt.conf.d/01keep-debs
```

다운로드된 모든 패키지는 `/var/cache/apt/archives/`에 저장됩니다.

### 방법 1: GPG 서명 검증(권장)

가장 신뢰할 수 있는 방법은 패키지의 GPG 서명을 확인하는 것입니다. 이를 통해 패키지가 당사에서 생성되었고 변조되지 않았음을 보장합니다.

``` bash
# Install the utility if missing
sudo apt-get install dpkg-sig

# Verify the signature of a specific package
dpkg-sig --verify /var/cache/apt/archives/dv-updater_*.deb
```

검사가 성공하면 진위를 나타내는 **GOODSIG** 상태가 표시됩니다. ✅

### 방법 2: 체크섬 검증

저장소 메타데이터에 나열된 체크섬과 비교하여 파일 무결성을 확인할 수도 있습니다.

1.  `apt-cache`로 패키지의 공식 체크섬을 확인합니다:

    ``` bash
    apt-cache show dv-updater
    ```

    출력에서 **SHA256** 항목을 찾습니다:

        Package: dv-updater
        Version: 0.0.11~RC01-nightly-20250717T220501Z
        Architecture: amd64
        Maintainer: dv-updater
        Installed-Size: 14500
        Filename: pool/main/d/dv-updater/dv-updater_0.0.11~RC01-nightly-20250717T220501Z_amd64.deb
        Size: 6025526
        SHA256: 2c60a10e0a55fb22903497280f78ab66e463e10a11b250c3147eb5672cd929bb
        Description: no description given

2.  다운로드된 파일의 체크섬을 계산합니다:

    ``` bash
    sha256sum /var/cache/apt/archives/dv-updater_0.0.11~RC01-nightly-20250717T220501Z_amd64.deb
    ```

3.  결과를 비교합니다. 해시 출력이 `apt-cache show`에서 확인한 값과 정확히 일치해야 합니다.

------------------------------------------------------------------------

## CentOS / RHEL / Fedora용

`dnf`와 `yum` 패키지 관리자는 기본적으로 다운로드한 패키지를 캐시에 저장합니다. 일반적으로 `/var/cache/dnf/` 내부의 하위 디렉터리에 위치합니다.

### 방법 1: GPG 서명 검증(권장)

다운로드한 `.rpm` 파일의 서명을 확인하려면 표준 `rpm` 유틸리티를 사용하세요. 가장 정확하고 신뢰할 수 있는 방법입니다.

``` bash
# Locate the package in the cache and verify it
rpm --checksig /var/cache/dnf/dvnet-*/packages/*.rpm
```

*참고: 경로는 시스템 버전에 따라 조금씩 다를 수 있습니다. `*`는 올바른 디렉터리를 자동으로 찾는 데 도움이 됩니다.*

서명이 유효하면 각 패키지에 대한 명령 출력에 `digests signatures OK`가 포함됩니다.

### 방법 2: 체크섬 검증

이 방법은 파일의 무결성만 확인하며, 진위는 확인하지 않습니다.

1.  저장소에서 패키지의 공식 체크섬을 가져옵니다:

    ``` bash
    dnf repoquery --info dv-processing
    ```

    `yum`을 사용하는 경우:

    ``` bash
    repoquery --info dv-processing
    ```

    출력에서 **Checksum** 항목을 찾습니다:

        Name         : dv-processing
        Version      : 0.6.6
        ...
        Checksum Type: sha256
        Checksum     : f019a9564433cacf7a1c307e9a358e43cb9a3325abcdef1234567890abcdef
        ...

2.  캐시에 있는 파일의 체크섬을 계산합니다:

    ``` bash
    sha256sum /var/cache/dnf/dvnet-*/packages/dv-processing_0.6.6_linux_amd64.rpm
    ```

3.  두 값을 비교합니다. 반드시 동일해야 합니다.