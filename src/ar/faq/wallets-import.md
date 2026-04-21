# استيراد المفاتيح إلى محفظة مشفرة

بعد تنزيل مفتاح خاص أو عبارة استرداد من DV.net تحتاج محفظة طرف ثالث. هنا MetaMask وOKX Wallet.

## أي محفظة

| | MetaMask | OKX Wallet |
|---|---|---|
| Ethereum وEVM | ✅ | ✅ |
| Base وBNB Chain وPolygon وArbitrum | ✅ | ✅ |
| Bitcoin (BTC) | ❌ | ✅ |
| Bitcoin Cash (BCH) | ❌ | ✅ |

EVM فقط: أيًا منهما. BTC/BCH: OKX.

## MetaMask

### التثبيت

- **المتصفح:** [metamask.io](https://metamask.io) → Download
- **الجوال:** متجر التطبيقات، «MetaMask»

ثبّت فقط من الموقع الرسمي.

### استيراد مفتاح خاص

1. افتح MetaMask
2. أيقونة الحساب أعلى اليمين
3. **Import account**
4. الصق المفتاح (يبدأ بـ `0x`)
5. **Import**

> يفتح هذا العنوان فقط.

### استيراد عبارة استرداد

> ⚠️ يستبدل محفظة MetaMask الحالية. احفظ عبارة المحفظة السابقة أولًا.

1. **Import an existing wallet**
2. 12 أو 24 كلمة بالترتيب
3. كلمة مرور وأكمل الإعداد

العنوان الأول تلقائيًا؛ التالي بـ **Add account**.

### إضافة شبكة

افتراضي Ethereum. لباقي الشبكات [chainlist.org](https://chainlist.org) → **Add to MetaMask**.

يدويًا:

| الشبكة | Chain ID | RPC URL |
|---|---|---|
| Base | 8453 | `https://mainnet.base.org` |
| BNB Chain | 56 | `https://bsc-dataseed.binance.org` |
| Polygon | 137 | `https://polygon-rpc.com` |
| Arbitrum One | 42161 | `https://arb1.arbitrum.io/rpc` |

### إزالة الحساب

1. قائمة الحساب
2. **⋮** بجانب الحساب
3. **Remove account**

## OKX Wallet

### التثبيت

- [okx.com/web3](https://www.okx.com/web3)
- الجوال: «OKX Wallet»

### استيراد مفتاح خاص

1. افتح OKX
2. **+** → **Import wallet → Private key**
3. **EVM** أو **Bitcoin** أو **Bitcoin Cash**
4. الصق المفتاح
5. كلمة المرور

ثم اختر الشبكة من الأعلى.

### استيراد عبارة

1. **Import wallet → Seed phrase**
2. الكلمات بالترتيب
3. عند الطلب مسار الاشتقاق (الجدول أدناه)
4. كلمة المرور

**مسارات DV.net:**

| الشبكة | المسار |
|---|---|
| Ethereum وEVM | `m/44'/60'/0'/0/N` |
| Bitcoin Legacy | `m/44'/0'/0'/0/N` |
| Bitcoin SegWit | `m/84'/0'/0'/0/N` |
| Bitcoin Cash | `m/44'/145'/0'/0/N` |

### الفهرس

بعد استيراد العبارة اضغط **Add account** متكررًا وقارن مع المعاملة.

### حذف المحفظة

1. إدارة المحافظ
2. **⋮**
3. **Delete wallet**

> الحذف من التطبيق لا يمحو الأموال على السلسلة.
