# 암호화폐 지갑으로 키 가져오기

DV.net에서 개인 키 또는 시드 구문을 받은 뒤에는 제3자 지갑으로 자금에 접근합니다. MetaMask와 OKX Wallet을 설명합니다.

## 어떤 지갑을 쓸까

| | MetaMask | OKX Wallet |
|---|---|---|
| Ethereum 및 EVM | ✅ | ✅ |
| Base, BNB Chain, Polygon, Arbitrum | ✅ | ✅ |
| Bitcoin (BTC) | ❌ | ✅ |
| Bitcoin Cash (BCH) | ❌ | ✅ |

EVM만 쓰면 둘 중 아무거나. BTC/BCH는 OKX Wallet.

## MetaMask

### 설치

- **브라우저:** [metamask.io](https://metamask.io) → Download
- **모바일:** 스토어에서 «MetaMask»

공식 사이트에서만 설치하세요.

### 개인 키 가져오기

1. MetaMask 실행
2. 오른쪽 위 계정 아이콘
3. **Import account**
4. 개인 키 붙여넣기(`0x`로 시작)
5. **Import**

> 개인 키로 가져오면 그 주소만 열립니다.

### 시드 구문 가져오기

> ⚠️ 시드 가져오기는 현재 MetaMask 지갑을 바꿉니다. 기존 지갑이 있으면 시드를 먼저 백업하세요.

1. **Import an existing wallet**
2. 12 또는 24단어 순서대로
3. 비밀번호 후 설정 완료

첫 주소는 자동; 다음은 **Add account**로 추가.

### 네트워크 추가

기본은 Ethereum. 다른 네트워크는 [chainlist.org](https://chainlist.org)에서 **Add to MetaMask**.

수동 설정:

| 네트워크 | Chain ID | RPC URL |
|---|---|---|
| Base | 8453 | `https://mainnet.base.org` |
| BNB Chain | 56 | `https://bsc-dataseed.binance.org` |
| Polygon | 137 | `https://polygon-rpc.com` |
| Arbitrum One | 42161 | `https://arb1.arbitrum.io/rpc` |

### 계정 제거

1. 계정 메뉴
2. 계정 옆 **⋮**
3. **Remove account**

## OKX Wallet

### 설치

- [okx.com/web3](https://www.okx.com/web3) 확장
- 모바일: «OKX Wallet»

### 개인 키 가져오기

1. OKX Wallet 실행
2. **+** → **Import wallet → Private key**
3. **EVM**, **Bitcoin** 또는 **Bitcoin Cash**
4. 개인 키 붙여넣기
5. 비밀번호

상단에서 네트워크 전환.

### 시드 구문 가져오기

1. **Import wallet → Seed phrase**
2. 12 또는 24단어
3. 필요 시 아래 표의 파생 경로
4. 비밀번호

**DV.net 파생 경로:**

| 네트워크 | 경로 |
|---|---|
| Ethereum 및 EVM | `m/44'/60'/0'/0/N` |
| Bitcoin Legacy | `m/44'/0'/0'/0/N` |
| Bitcoin SegWit | `m/84'/0'/0'/0/N` |
| Bitcoin Cash | `m/44'/145'/0'/0/N` |

### 인덱스로 주소 찾기

시드 가져온 뒤 **Add account**를 반복하며 주소를 거래와 비교합니다.

### 지갑 삭제

1. 지갑 관리
2. **⋮**
3. **Delete wallet**

> 앱에서 지갑을 지워도 온체인 자금은 삭제되지 않으며, 해당 앱에서의 접근만 사라집니다.
