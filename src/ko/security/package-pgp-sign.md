# 패키지 및 설치된 소프트웨어 검증

## GPG로 당사 패키지의 진위를 검증하기

당사의 `.deb` 및 `.rpm` 패키지와 해당 체크섬은 모두 GPG 키로 암호학적 서명이 되어 있습니다. 이는 사용자가 다운로드하는 패키지가 당사에서 생성되었으며 제3자에 의해 변경되거나 손상되지 않았음을 보장합니다. 공개 키를 사용하여 패키지의 진위를 쉽게 검증할 수 있습니다.

모든 프로젝트 소스 코드, 해당 컴파일된 실행 파일, 그리고 `.deb` 및 `.rpm` 패키지는 github.com의 릴리스에 게시됩니다. 이에 해당하는 서명은 `.sig` 파일로 함께 제공됩니다.

예: https://github.com/dv-net/dv-merchant/releases/tag/v0.9.4

![github-signed-assets.png](../../assets/images/security/github-signed-assets.png)

-----

### 1단계: 당사의 공개 GPG 키 가져오기

먼저 공개 키를 키링에 가져와야 합니다. 이 작업은 한 번만 수행하면 됩니다. 당사의 키는 [https://dv.net/gpg.pub](https://dv.net/gpg.pub)에 게시되어 있습니다.

공개 키를 서버에 저장합니다:

```bash
curl https://dv.net/gpg.pub -o dv-net.asc
```

그런 다음 키링에 가져옵니다:

```bash
gpg --import dv-net.asc
```

-----

### 2단계: 패키지 서명 검증

키를 가져온 후 다운로드한 패키지의 서명을 검증할 수 있습니다.

#### .deb 패키지(Debian/Ubuntu)용

`.deb` 패키지를 검증하려면 `dpkg-sig` 명령을 사용합니다. 설치되어 있지 않다면 `sudo apt-get install dpkg-sig`로 설치할 수 있습니다.

```bash
dpkg-sig --verify package_name.deb
```

서명이 유효하면 출력에서 신뢰된 키의 **GOODSIG** 상태가 표시됩니다.

#### .rpm 패키지(Fedora/CentOS/RHEL)용

`.rpm` 패키지를 검증하려면 `rpm` 명령을 사용합니다.

```bash
rpm --checksig package_name.rpm
```

서명이 올바르면 명령의 출력에 모든 검사(‘`gpg`’ 포함)가 성공적으로 통과했음이 나타나며 (`OK`)로 표시됩니다.

이러한 간단한 단계를 따르면 당사 소프트웨어 패키지의 무결성과 진위를 보장할 수 있습니다.