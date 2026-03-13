# 블록체인에서 블록 다시 읽기

> ⚠️ **고급 사용자 전용.** 모든 작업은 사용자 책임 하에 수행됩니다. 데이터베이스를 잘못 수정하면 거래 손실 또는 중복이 발생할 수 있습니다. 진행하기 전에 각 단계를 이해했는지 확인하세요.

## 문제

이더리움 네트워크의 블록 재구성으로 인해 블록체인에서 확인된 거래가 시스템에 없을 수 있습니다. 처리기가 임시(버려진) 체인 분기의 블록을 처리하고 메인 체인의 해당 블록을 건너뛴 경우 발생합니다. 올바른 상태를 복원하려면 필요한 블록을 수동으로 다시 읽도록 트리거해야 합니다.

## 해결 방법

### 1. 데이터베이스 백업 만들기

```bash
sudo -u postgres pg_dump dv-processing > /tmp/dv-processing_backup_$(date +%Y%m%d_%H%M%S).sql
```

파일이 생성되었고 비어 있지 않은지 확인하세요:

```bash
ls -lh /tmp/dv-processing_backup_*.sql
```
### 2. (!중요 — 별도 터미널에서) 처리 중지

```bash
sudo systemctl stop dv-processing
```
### 3. (메인 터미널에서) 데이터베이스 사용자로 전환

```bash
sudo su
sudo su - postgres
```
### 4. (메인 터미널에서) psql 시작

```bash
psql
```

또는

```bash
/home/dv/embedded/usr/local/pgsql/bin/psql -p 5433
```
### 5. (메인 터미널에서) dv-processing 데이터베이스에 연결

```sql
\c dv-processing
```
### 6. (메인 터미널에서) 현재 파싱 상태 읽기

```sql
select number from processed_blocks where blockchain = 'bsc';
```

> !중요 — 결과를 기억하세요:
> ```
>   number
> ----------
>  81923203
> (1 row)
> ```
### 7. (메인 터미널에서) 값을 거래의 블록 -1로 업데이트

거래 `0xffe238ba2c1e028a8ec1c467cef53fa59112e2ccc922dc64345817f9da0f4e71` — 블록 `81921203` 예시:

```sql
update processed_blocks set number = 81921203 where blockchain = 'bsc';
```
### 8. (!중요 — 별도 터미널에서) 처리 시작

```bash
sudo systemctl start dv-processing
```
### 9. (메인 터미널에서) 몇 분 후 블록이 진행되었는지 확인

값이 `81921203`에서 수십 또는 수백 단위로 증가했어야 하며, 이는 블록이 성공적으로 다시 읽혔음을 나타냅니다.

```sql
select number from processed_blocks where blockchain = 'bsc';
```
### 10. (!중요 — 별도 터미널에서) 처리 중지

```bash
sudo systemctl stop dv-processing
```
### 11. (메인 터미널에서) 블록 값을 6단계에서 적어둔 값으로 복원

```sql
update processed_blocks set number = 81923203 where blockchain = 'bsc';
```
### 12. (!중요 — 별도 터미널에서) 처리 시작

```bash
sudo systemctl start dv-processing
```

이후 거래가 캡처될 가능성이 높습니다.
