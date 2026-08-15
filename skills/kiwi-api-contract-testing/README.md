# 🔗 Kiwi API Contract Testing Skill

Быстрый старт для контрактного тестирования API с помощью `kiwi-api-contract-testing`.

## 📋 Что делает скилл

- Валидирует OpenAPI/Swagger спецификации
- Проверяет GraphQL схемы
- Тестирует Consumer-Driven Contracts (Pact)
- Обнаруживает breaking changes
- Создаёт отчёт `contract.validation.yml`

## 🔧 Быстрый старт

### 1. Проверка OpenAPI спецификации

```bash
npx @kiwi-tcms-ai/kiwi-tcms-skills kiwi-api-contract-testing --spec=openapi.yaml
```

**Выходные данные:**
- `contract.validation.yml` с результатами валидации
- Список breaking changes (если есть)
- Рекомендации по улучшению спецификации

### 2. Расширенная проверка с Pact Broker

Создайте файл `contract-config.yml`:

```yaml
openapi:
  spec_url: https://api.example.com/swagger.json
  check_breaking_changes: true
  previous_version: v1.2.3
  
graphql:
  schema_url: https://api.example.com/graphql
  introspection: true
  
pact:
  broker_url: https://pact.example.com
  consumer: web-frontend
  provider: backend-api
  tags: [main, production]
  
gRPC:
  proto_files:
    - protos/service.proto
    - protos/models.proto
    
report:
  format: yaml # или json, html
  include_examples: true
```

Запустите:

```bash
npx @kiwi-tcms-ai/kiwi-tcms-skills kiwi-api-contract-testing --config=contract-config.yml
```

## 📊 Типы контрактов

| Тип | Описание | Инструменты |
| --- | --- | --- |
| **OpenAPI/Swagger** | REST API спецификация | Swagger CLI, Spectral |
| **GraphQL Schema** | Типы, запросы, мутации | GraphQL ESLint, Apollo CLI |
| **Pact CDC** | Consumer-Driven Contracts | Pact, Pactflow |
| **gRPC Protobuf** | Protocol Buffers | buf, protoc |
| **AsyncAPI** | Event-driven API | AsyncAPI CLI |

## 🛠️ Breaking Changes Detection

### Категории изменений

#### ❌ Breaking (требуют major version)
- Удаление endpoint/method
- Удаление обязательного поля
- Изменение типа поля (string → number)
- Удаление enum value
- Изменение формата ответа (JSON → XML)
- Ужесточение валидации

#### ⚠️ Non-breaking (minor/patch version)
- Добавление нового endpoint
- Добавление опционального поля
- Добавление нового enum value
- Расширение валидации (более строгие правила)

#### ✅ Safe (любая версия)
- Исправление опечаток в описании
- Добавление примеров
- Улучшение документации

## 📈 Пример отчёта

`contract.validation.yml`:

```yaml
validation:
  id: contract-2024-08-15-001
  date: 2024-08-15T11:00:00Z
  api_type: OpenAPI 3.0.3
  spec_version: v2.0.0
  
summary:
  total_checks: 156
  passed: 148
  failed: 8
  warnings: 12
  
  breaking_changes_count: 3
  compatibility: ❌ FAIL
  
breaking_changes:
  - id: BC-001
    severity: critical
    type: field_removed
    path: /users/{id}.GET.response.email
    description: Поле 'email' удалено из ответа
    impact: Все клиенты, использующие это поле, сломаются
    migration: |
      Варианты:
      1. Вернуть поле с пометкой @deprecated
      2. Увеличить major version API
      3. Предоставить поле в новом формате
      
  - id: BC-002
    severity: critical
    type: type_changed
    path: /products.GET.response.price
    description: Тип изменён с number на string
    before: price: number (float)
    after: price: string (formatted)
    migration: |
      Добавьте новое поле price_formatted, оставив price как number
      
  - id: BC-003
    severity: high
    type: enum_value_removed
    path: /orders.POST.request.status
    description: Удалено значение 'PENDING' из enum OrderStatus
    remaining_values: [CREATED, PROCESSING, SHIPPED, DELIVERED]
    migration: |
      Используйте 'CREATED' вместо 'PENDING'
      
warnings:
  - id: W-001
    type: missing_description
    path: /users/{id}.PATCH.request.bio
    recommendation: Добавьте описание поля
    
  - id: W-002
    type: missing_example
    path: /products.GET.response.sku
    recommendation: Добавьте пример значения
    
pact_verification:
  consumer: web-frontend
  provider: backend-api
  pact_broker: https://pact.example.com
  
  results:
    - test: GET /users returns user object
      status: ✅ PASS
      
    - test: POST /orders creates order
      status: ❌ FAIL
      failure: |
        Expected status 201, got 200
        Response body missing 'orderNumber' field
        
    - test: GET /products filters by category
      status: ✅ PASS
      
  can_deploy: false # Есть failing pacts
  
recommendations:
  - priority: 1
    action: Откатить breaking changes или увеличить major version
    effort: high
    
  - priority: 2
    action: Исправить failing Pact tests
    effort: medium
    
  - priority: 3
    action: Добавить описания и примеры ко всем полям
    effort: low
```

## 🎯 Best Practices

### 1. Версионирование API
```yaml
Рекомендуемая стратегия:
- Major: Breaking changes (v1 → v2)
- Minor: Новые функции без breaking changes (v1.1 → v1.2)
- Patch: Багфиксы (v1.2.0 → v1.2.1)

URL patterns:
- https://api.example.com/v1/users (URL versioning)
- Accept: application/vnd.example.v1+json (Header versioning)
```

### 2. Deprecation Policy
```yaml
Жизненный цикл устаревания:
1. Добавить @deprecated annotation
2. Обновить документацию
3. Уведомить потребителей (за 3 месяца)
4. Продолжать поддерживать (min 6 месяцев)
5. Удалить в следующем major version
```

### 3. CI/CD Integration
```yaml
Проверки в пайплайне:
- Валидация spec при каждом коммите
- Breaking changes detection перед мержем
- Pact verification перед деплоем
- Can I deploy? запрос в Pact Broker
```

## 🔗 Интеграция с CI/CD

Пример GitHub Actions:

```yaml
name: API Contract Tests

on:
  pull_request:
    paths:
      - 'api-specs/**'
      - 'src/**/*.proto'
  push:
    branches: [main]

jobs:
  validate-openapi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate OpenAPI Spec
        run: npx @kiwi-tcms-ai/kiwi-tcms-skills kiwi-api-contract-testing --spec=api-specs/openapi.yaml
        
      - name: Check Breaking Changes
        run: |
          if grep -q "breaking_changes_count: [1-9]" contract.validation.yml; then
            echo "::error::Обнаружены breaking changes!"
            echo "Требуется согласование и увеличение major version"
            exit 1
          fi
          
  pact-verification:
    runs-on: ubuntu-latest
    needs: validate-openapi
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Pact CLI
        run: npm install -g @pact-foundation/pact-cli
        
      - name: Verify Provider
        run: |
          pact-provider-verifier \
            --provider=backend-api \
            --broker-url=https://pact.example.com \
            --consumer-version-tag=main \
            --provider-version=${{ github.sha }}
            
      - name: Can Deploy?
        run: |
          pact-broker can-i-deploy \
            --provider=backend-api \
            --broker-url=https://pact.example.com \
            --to-environment=production
```

### Интеграция со Spectral (OpenAPI linting)

```yaml
# .spectral.yml
extends: [[spectral:oas, all]]

rules:
  operation-description: error
  operation-tags: error
  no-eval-in-markdown: error
  contact-properties: error
  
  # Custom rules
  no-x-internal:
    description: "Internal fields should not be in public spec"
    severity: error
    given: $..[?(@property === 'x-internal')]
    then:
      function: falsy
```

```bash
# Запуск spectral
spectral lint openapi.yaml
```

## ⚠️ Troubleshooting

| Проблема | Решение |
| --- | --- |
 | Ложные breaking changes | Проверьте, действительно ли изменение ломает клиентов |
| Pact Broker недоступен | Используйте локальные pact файлы для разработки |
| Сложно определить тип изменения | Запустите тесты с реальными клиентами (canary deployment) |
| gRPC proto не компилируется | Проверьте версии protoc и совместимость импортов |

## 📚 Инструменты

### OpenAPI
- **Swagger CLI** — валидация и генерация
- **Spectral** — линтинг правил
- **Redocly** — документация и валидация
- **OpenAPI Generator** — генерация клиентов

### Pact
- **Pact CLI** — создание и верификация контрактов
- **Pactflow** — хостинг Pact Broker
- **Pact JS/Go/Ruby** — библиотеки для разных языков

### GraphQL
- **Apollo CLI** — валидация схем
- **GraphQL ESLint** — линтинг
- **GraphQL Code Generator** — генерация типов

### gRPC
- **buf** — управление protobuf
- **protoc** — компилятор
- **grpcurl** — тестирование gRPC сервисов

## 📚 Дополнительные ресурсы

- [OpenAPI Specification](https://swagger.io/specification/)
- [Pact Documentation](https://docs.pact.io/)
- [GraphQL Schema Design](https://graphql.org/learn/schema/)
- [Breaking Changes Best Practices](https://apisyouwonthate.com/blog/api-breaking-changes-and-how-to-avoid-them)
- [Примеры в docs/examples.md](../../docs/examples.md#25-kiwi-api-contract-testing)

## 🆘 Помощь

- [Troubleshooting Guide](../../TROUBLESHOOTING.md)
- [Decision Tree](../../docs/DECISION-TREE.md)
- [Workflow Guide](../../.kiwi-workflow.yml)
