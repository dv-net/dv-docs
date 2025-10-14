<div align="center">

# 📚 DV Docs - OpenAPI Documentation Generator

Automatic generation of multilingual documentation from an OpenAPI specification using VitePress

[![VitePress](https://img.shields.io/badge/VitePress-1.6.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitepress.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0.1-6BA539?style=flat&logo=openapi-initiative&logoColor=white)](https://www.openapis.org/)

</div>

---

## 🚀 Quick Start

1️⃣ **Install dependencies**
   ```bash
   npm install
   ```

2️⃣ **Prepare the OpenAPI specification**

Place the `openapi.json` file into the `scripts/` folder.

> ⚠️ **Important**: The format must be OpenAPI 3.0.1
>
> 💡 To convert Swagger to OpenAPI use [Swagger Editor](https://editor.swagger.io/)

3️⃣ **Generate English translations**
   ```bash
   npm run docs:genTranslation
   ```

> Run this command when adding new endpoints or when changing names/descriptions.

4️⃣ **Translate section titles**

Open and translate the titles in `src/{locale}/t.json` files for the required languages.

5️⃣ **Generate the documentation**
   ```bash
   npm run docs:genDoc
   ```

6️⃣ **Build the project**
   ```bash
   npm run build
   ```

7️⃣ **Run the dev server**
   ```bash
   npm run dev
   ```
---

## 🌍 Supported Languages

- 🇬🇧 English (en)
- 🇷🇺 Russian (ru)
- 🇩🇪 Deutsch (de)
- 🇪🇸 Español (es)
- 🇨🇳 中文 (zh)
- 🇰🇷 한국어 (ko)
- 🇮🇳 हिन्दी (hi)
- 🇸🇦 العربية (ar)

---

## ➕ Adding a New Language

### Step-by-Step Guide

1️⃣ **Register the language**

Add the new language to [`scripts/regions.json`](scripts/regions.json):

```json
{ "locale": "fr", "name": "Français", "flag": "🇫🇷" }
```

2️⃣ **Generate translations**

Repeat steps 3–6 from the Quick Start section.

3️⃣ **Update mappings**

Add the language configuration to [`.vitepress/mappers.ts`](.vitepress/mappers.ts).

4️⃣ **Translate UI elements**

Add button translations to [`scripts/buttonText.ts`](scripts/buttonText.ts).

5️⃣ **Create textual documentation**

Add translated pages to the `src/{lang}/` folder:
- 📁 `installation/` - Installation instructions
- 📁 `integration/` - Integration guides
- 📁 `operations/` - Operations description

Translate texts in the following files:
- `src/{lang}/titles.json` - Section titles
- `src/{lang}/defaultTranslate.json` - Common translations

---

## 📊 Google Analytics

### Analytics setup

1️⃣ **Create a `.env` file on the server**

Copy the template from [`.env.example`](.env.example):

```bash
cp .env.example .env
```

2️⃣ **Fill in the environment variables**

```
env VITE_GA_ID=G-XXXXXXXXXX
```

> ℹ️ **Note**: Analytics only works in production mode

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 🔥 Start the dev server with hot reload |
| `npm run build` | 📦 Build the production version |
| `npm run docs:genTranslation` | 🔤 Generate English translations from OpenAPI |
| `npm run docs:genDoc` | 📄 Generate documentation for all languages |
| `npm run preview` | 👁️ Preview the production build |

<br>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br>

<div align="center">

**© 2025 DV.net** • [DV Technologies Ltd.](https://dv.net)

*Built with ❤️ for the crypto community*

</div>
