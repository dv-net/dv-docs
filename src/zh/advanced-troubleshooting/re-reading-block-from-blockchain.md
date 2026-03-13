# 从区块链重新读取区块

> ⚠️ **仅限高级用户。** 所有操作风险自负。错误修改数据库可能导致交易丢失或重复。请确保在继续之前理解每一步。

## 问题

由于以太坊网络中的区块重组，已在区块链上确认的交易可能在系统中缺失。当处理程序处理了临时（已丢弃）链分支中的区块并跳过了主链中的对应区块时，就会出现这种情况。要恢复正确状态，您需要手动触发重新读取所需区块。

## 解决方案

### 1. 创建数据库备份

```bash
sudo -u postgres pg_dump dv-processing > /tmp/dv-processing_backup_$(date +%Y%m%d_%H%M%S).sql
```

确认文件已创建且不为空：

```bash
ls -lh /tmp/dv-processing_backup_*.sql
```
### 2. （!重要 — 在单独终端中）停止处理

```bash
sudo systemctl stop dv-processing
```
### 3. （在主终端中）切换到数据库用户

```bash
sudo su
sudo su - postgres
```
### 4. （在主终端中）启动 psql

```bash
psql
```

或

```bash
/home/dv/embedded/usr/local/pgsql/bin/psql -p 5433
```
### 5. （在主终端中）连接到 dv-processing 数据库

```sql
\c dv-processing
```
### 6. （在主终端中）读取当前解析状态

```sql
select number from processed_blocks where blockchain = 'bsc';
```

> !重要 — 请记住结果：
> ```
>   number
> ----------
>  81923203
> (1 row)
> ```
### 7. （在主终端中）将值更新为您交易的区块 -1

例如交易 `0xffe238ba2c1e028a8ec1c467cef53fa59112e2ccc922dc64345817f9da0f4e71` — 区块 `81921203`：

```sql
update processed_blocks set number = 81921203 where blockchain = 'bsc';
```
### 8. （!重要 — 在单独终端中）启动处理

```bash
sudo systemctl start dv-processing
```
### 9. （在主终端中）几分钟后，验证区块是否已前进

数值应从 `81921203` 增加数十或数百 — 这表示区块已成功重新读取。

```sql
select number from processed_blocks where blockchain = 'bsc';
```
### 10. （!重要 — 在单独终端中）停止处理

```bash
sudo systemctl stop dv-processing
```
### 11. （在主终端中）将区块值恢复为第 6 步中记录的值

```sql
update processed_blocks set number = 81923203 where blockchain = 'bsc';
```
### 12. （!重要 — 在单独终端中）启动处理

```bash
sudo systemctl start dv-processing
```

此后，交易很可能会被捕获。
