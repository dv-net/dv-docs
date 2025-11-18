# 使用 Docker 安装并运行 DV.net

> 功能强大的多服务加密商户应用，支持自动配置——只需克隆并运行即可！

我们已准备好一套脚本，便于通过 Docker 快速部署 **DV.net** 加密商户。
所有必需内容都已汇总在此仓库：
[https://github.com/dv-net/dv-bundle](https://github.com/dv-net/dv-bundle)

## 🏃‍♂️ 快速开始

执行以下命令即可运行：

```bash
git clone --recursive https://github.com/dv-net/dv-bundle.git
cd dv-bundle
cp .env.example .env  # Configure environment variables if necessary
docker compose up -d
```

**完成！** 你的加密商户将可通过以下地址访问：
🔗 [http://localhost:80](https://www.google.com/search?q=http://localhost:80)


## 🐳 ⚙️ Docker Desktop 配置（Windows / macOS）

对于 Windows 和 macOS 上的 **Docker Desktop** 用户，需要启用以下选项：

`Enable host networking`
*(位置：Settings → Resources → Network)*

<a href="../../assets/images/installation/docker-instalation.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Docker Desktop</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Docker Desktop\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/docker-instalation.png" alt="Docker Desktop" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## 🏗️ 项目架构

```
📦 dv-bundle/
├── 📂 data/                  # Persistent data storage
├── 🛠️ scripts/               # Automation and configuration scripts
└── 🐳 services/              # Service container submodules
    ├── 📦 dv-merchant/       # Merchant service
    └── 📦 dv-processing/     # Payment processing service
├── .env.example              # Environment variables template
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # Documentation
```


## 🔧 开发与更新

```bash
# Update all submodules to the latest versions
git submodule update --remote

# Rebuild and restart services
docker compose up --build -d
```


## 🐛 常见问题排查

**如果子模块未加载：**

```bash
git submodule update --init --recursive
```

**Docker 容器问题：**

```bash
docker compose down && docker compose up --build -d
```

**清理并完全重启：**

```bash
docker compose down -v && docker compose up --build -d
```

> 💡 **提示：** 完成配置后，别忘了检查各服务是否正常运行，并在 `.env` 文件中按需调整参数。