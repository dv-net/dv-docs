# 시드 구문: 내보내기, 가져오기 및 입금 주소 찾기

시드 구문은 가맹점의 마스터 키입니다. 모든 핫 지갑 주소는 이로부터 수학적으로 유도됩니다. 시드로 모든 주소를 복구하고 생성된 입금 주소를 나열할 수 있습니다.

> ⚠️ **시스템에서 가장 민감한 비밀입니다.** 아는 사람은 모든 지갑에 접근할 수 있습니다. 오프라인·안전하게 보관하고 절대 공유하지 마세요.

## 시드 구문 내보내기

1. **Transfers → Hot Wallets**
2. 오른쪽 위 **Download seed phrases**
3. 2단계 인증
4. 안전하게 파일 저장

> 종이 또는 인터넷에 연결되지 않은 장치에 보관하는 것을 권장합니다.

## 지갑에 시드 구문 가져오기

표준 암호화폐 지갑으로 가맹점의 모든 주소에 접근할 수 있습니다.

### MetaMask (EVM)

1. [MetaMask](https://metamask.io) 설치
2. 환영 화면에서 **Import an existing wallet**
3. 시드 구문(12 또는 24단어) 순서대로 입력
4. 비밀번호 설정 후 완료
5. 상단에서 네트워크 전환

> Ethereum, Base, BNB Chain, Polygon, Arbitrum 등 모든 EVM을 지원합니다.

### OKX Wallet (EVM + BTC 등)

1. [OKX Wallet](https://www.okx.com/web3) 설치
2. **Import wallet → Seed phrase**
3. 순서대로 시드 입력
4. 비밀번호 후 완료
5. 지갑에서 네트워크·코인 선택

> EVM, 비트코인, 비트코인캐시 등 여러 체인을 지원합니다.

## 시드 구문으로 입금 주소 찾기

DV.net은 표준 파생 경로(derivation path)를 사용합니다.

### 표준 경로

| 네트워크 | 파생 경로 |
|---|---|
| Ethereum 및 모든 EVM | `m/44'/60'/0'/0/N` |
| Bitcoin (Legacy) | `m/44'/0'/0'/0/N` |
| Bitcoin (SegWit) | `m/84'/0'/0'/0/N` |
| Bitcoin Cash | `m/44'/145'/0'/0/N` |

`N`은 주소 인덱스(0, 1, 2, …)입니다.

### 특정 주소 찾기

파생 주소·인덱스·개인 키를 한 번에 보여 주는 도구가 가장 편합니다.

#### 도구: iancoleman BIP39

[iancoleman.io/bip39](https://iancoleman.io/bip39/) — 오픈 소스이며 페이지를 저장해 오프라인으로 사용할 수 있습니다.

> ⚠️ **시드 구문은 오프라인에서만 입력하세요.** 브라우저에서 페이지를 저장한 뒤 인터넷을 끄고 입력하세요. 타인 기기나 온라인 상태에서 입력하지 마세요.

**사용 방법:**

1. 사이트를 열고 저장(Ctrl+S / Cmd+S)
2. 오프라인에서 저장 파일 열기
3. **BIP39 Mnemonic**에 시드 입력
4. **Coin**에서 선택: EVM 전체는 `ETH — Ethereum`, 비트코인은 `BTC`, BCH는 `BCH`
5. **Derivation Path**에서 **BIP44** 또는 SegWit은 **BIP84**
6. **Derived Addresses** 표에서 주소 확인
7. 거래와 일치하는 주소 찾기
8. 해당 개인 키를 복사해 지갑으로 가져오기

기본적으로 인덱스 0–19가 표시됩니다. **Show more rows** 또는 **starting from index**로 늘리세요.

> 대부분의 주소는 0–1000 범위입니다. 처음 20에 없으면 20씩 범위를 넓이세요.
