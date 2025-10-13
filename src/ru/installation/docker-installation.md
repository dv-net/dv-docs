# Установка и запуск DV.net с помощью Docker

> Мощное мультисервисное приложение для криптомерчанта с автоматической настройкой — просто клонируй и работай!

Мы подготовили готовый набор скриптов для быстрого развертывания криптомерчанта **DV.net** через Docker. Все необходимое собрано в репозитории:  
[https://github.com/dv-net/dv-bundle](https://github.com/dv-net/dv-bundle)


## 🏃‍♂️ Быстрый старт

Выполните следующие команды для запуска:

```bash
git clone --recursive https://github.com/dv-net/dv-bundle.git
cd dv-bundle
cp .env.example .env  # Настройте переменные окружения при необходимости
docker compose up -d
```

**Готово!** Ваш криптомерчант будет доступен по адресу:  
🔗 [http://localhost:80](http://localhost:80)


## 🐳 ⚙️ Настройка Docker Desktop (Windows / macOS)

Для пользователей **Docker Desktop** на Windows и macOS необходимо включить опцию:

`Enable host networking`  
*(Находится в разделе Settings → Resources → Network)*

![Настройка Docker Desktop](../../assets/images/installation/docker-instalation.png)


## 🏗️ Архитектура проекта

```
📦 dv-bundle/
├── 📂 data/                  # Постоянное хранилище данных
├── 🛠️ scripts/               # Скрипты автоматизации и конфигурации
└── 🐳 services/              # Подмодули сервисных контейнеров
    ├── 📦 dv-merchant/       # Сервис мерчанта
    └── 📦 dv-processing/     # Сервис обработки платежей
├── .env.example              # Шаблон переменных окружения
├── docker-compose.yml        # Конфигурация Docker Compose
└── README.md                 # Документация
```

## 🔧 Разработка и обновление

```bash
# Обновить все подмодули до последних версий
git submodule update --remote

# Пересобрать и перезапустить сервисы
docker compose up --build -d
```

## 🐛 Решение частых проблем

**Если подмодули не загрузились:**
```bash
git submodule update --init --recursive
```

**Проблемы с контейнерами Docker:**
```bash
docker compose down && docker compose up --build -d
```

**Очистка и полный перезапуск:**
```bash
docker compose down -v && docker compose up --build -d
```


> 💡 **Совет:** После настройки не забудьте проверить работу сервисов и настроить параметры в файле `.env` под ваши нужды.
```





