# Releer un bloque de la blockchain

> ⚠️ **Solo para usuarios avanzados.** Todas las acciones se realizan bajo su propia responsabilidad. Los cambios incorrectos en la base de datos pueden provocar pérdida o duplicación de transacciones. Asegúrese de entender cada paso antes de continuar.

## Problema

Debido a la reorganización de bloques en la red Ethereum, una transacción confirmada en la blockchain puede faltar en el sistema. Esto ocurre cuando el procesamiento ha manejado un bloque de una rama temporal (descartada) de la cadena y ha omitido el bloque correspondiente de la cadena principal. Para restaurar el estado correcto, debe iniciar manualmente la relectura del bloque requerido.

## Solución

### 1. Crear una copia de seguridad de la base de datos

```bash
sudo -u postgres pg_dump dv-processing > /tmp/dv-processing_backup_$(date +%Y%m%d_%H%M%S).sql
```

Compruebe que el archivo se creó y no está vacío:

```bash
ls -lh /tmp/dv-processing_backup_*.sql
```
### 2. (!IMPORTANTE — en un terminal aparte) Detener el procesamiento

```bash
sudo systemctl stop dv-processing
```
### 3. (en el terminal principal) Cambiar al usuario de la base de datos

```bash
sudo su
sudo su - postgres
```
### 4. (en el terminal principal) Iniciar psql

```bash
psql
```

o

```bash
/home/dv/embedded/usr/local/pgsql/bin/psql -p 5433
```
### 5. (en el terminal principal) Conectar a la base de datos dv-processing

```sql
\c dv-processing
```
### 6. (en el terminal principal) Leer el estado actual del análisis

```sql
select number from processed_blocks where blockchain = 'bsc';
```

> !IMPORTANTE — recuerde el resultado:
> ```
>   number
> ----------
>  81923203
> (1 row)
> ```
### 7. (en el terminal principal) Actualizar el valor al bloque -1 de su transacción

Ejemplo para la transacción `0xffe238ba2c1e028a8ec1c467cef53fa59112e2ccc922dc64345817f9da0f4e71` — bloque `81921203`:

```sql
update processed_blocks set number = 81921203 where blockchain = 'bsc';
```
### 8. (!IMPORTANTE — en un terminal aparte) Iniciar el procesamiento

```bash
sudo systemctl start dv-processing
```
### 9. (en el terminal principal) Tras un par de minutos, comprobar que los bloques han avanzado

El valor debería haber aumentado varias decenas o centenas desde `81921203` — esto indica una relectura correcta del bloque.

```sql
select number from processed_blocks where blockchain = 'bsc';
```
### 10. (!IMPORTANTE — en un terminal aparte) Detener el procesamiento

```bash
sudo systemctl stop dv-processing
```
### 11. (en el terminal principal) Restaurar el valor del bloque al anotado en el paso 6

```sql
update processed_blocks set number = 81923203 where blockchain = 'bsc';
```
### 12. (!IMPORTANTE — en un terminal aparte) Iniciar el procesamiento

```bash
sudo systemctl start dv-processing
```

Después de esto, la transacción será capturada con alta probabilidad.
