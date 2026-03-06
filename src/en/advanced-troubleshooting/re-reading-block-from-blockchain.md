# Re-reading a Block from Blockchain

> ⚠️ **For advanced users only.** All actions are performed at your own risk. Incorrect changes to the database may result in loss or duplication of transactions. Make sure you understand each step before proceeding.

## Problem

Due to block reorganization in the Ethereum network, a transaction that is confirmed on the blockchain may be missing from the system. This happens when processing has handled a block from a temporary (discarded) chain branch and skipped the corresponding block from the main chain. To restore the correct state, you need to manually trigger re-reading of the required block.

## Solution

### 1. Create a database backup

```bash
sudo -u postgres pg_dump dv-processing > /tmp/dv-processing_backup_$(date +%Y%m%d_%H%M%S).sql
```

Verify that the file was created and is not empty:

```bash
ls -lh /tmp/dv-processing_backup_*.sql
```
### 2. (!IMPORTANT — in a separate terminal) Stop processing

```bash
sudo systemctl stop dv-processing
```
### 3. (in the main terminal) Switch to the database user

```bash
sudo su
sudo su - postgres
```
### 4. (in the main terminal) Start psql

```bash
psql
```

or

```bash
/home/dv/embedded/usr/local/pgsql/bin/psql -p 5433
```
### 5. (in the main terminal) Connect to the dv-processing database

```sql
\c dv-processing
```
### 6. (in the main terminal) Read the current parsing state

```sql
select number from processed_blocks where blockchain = 'bsc';
```

> !IMPORTANT — remember the result:
> ```
>   number
> ----------
>  81923203
> (1 row)
> ```
### 7. (in the main terminal) Update the value to block -1 of your transaction

Example for transaction `0xffe238ba2c1e028a8ec1c467cef53fa59112e2ccc922dc64345817f9da0f4e71` — block `81921203`:

```sql
update processed_blocks set number = 81921203 where blockchain = 'bsc';
```
### 8. (!IMPORTANT — in a separate terminal) Start processing

```bash
sudo systemctl start dv-processing
```
### 9. (in the main terminal) After a couple of minutes, verify that blocks have advanced

The value should have increased by several tens or hundreds from `81921203` — this indicates successful block re-reading.

```sql
select number from processed_blocks where blockchain = 'bsc';
```
### 10. (!IMPORTANT — in a separate terminal) Stop processing

```bash
sudo systemctl stop dv-processing
```
### 11. (in the main terminal) Restore the block value to what you noted in step 6

```sql
update processed_blocks set number = 81923203 where blockchain = 'bsc';
```
### 12. (!IMPORTANT — in a separate terminal) Start processing

```bash
sudo systemctl start dv-processing
```

After this, the transaction will most likely be picked up.
