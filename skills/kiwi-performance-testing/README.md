# 🚀 Kiwi Performance Testing Skill

Быстрый старт для проведения нагрузочного тестирования с помощью `kiwi-performance-testing`.

## 📋 Что делает скилл

- Проектирует нагрузочные тесты (load, stress, spike, soak)
- Генерирует сценарии для k6/JMeter/Gatling
- Определяет SLA/SLO метрики
- Анализирует результаты и выявляет узкие места
- Создаёт отчёт `performance.report.yml`

## 🔧 Быстрый старт

### 1. Базовый сценарий

```bash
npx @kiwi-tcms-ai/kiwi-tcms-skills kiwi-performance-testing
```

**Входные данные:**
- Критические пользовательские сценарии (текстом или ссылки на требования)
- Целевая нагрузка (RPS, количество пользователей)
- Длительность теста

**Выходные данные:**
- `performance.report.yml` с планом тестирования
- Сценарии для k6/JMeter
- Рекомендации по SLA/SLO

### 2. Расширенный сценарий с параметрами

Создайте файл `performance-config.yml`:

```yaml
scenarios:
  - name: Checkout Flow
    type: load
    duration: 30m
    ramp_up: 5m
    target_rps: 100
    sla:
      p95_latency_ms: 500
      p99_latency_ms: 1000
      error_rate_percent: 0.1
      
  - name: Search API
    type: stress
    duration: 15m
    ramp_up: 2m
    target_rps: 500
    sla:
      p95_latency_ms: 200
      error_rate_percent: 0.5

tool: k6 # или jmeter, gatling
environment: staging
baseline: true # сравнение с базовой линией
```

Запустите:

```bash
npx @kiwi-tcms-ai/kiwi-tcms-skills kiwi-performance-testing --config=performance-config.yml
```

## 📊 Типы тестов

| Тип | Описание | Когда использовать |
| --- | --- | --- |
| **Load** | Плановая нагрузка | Проверка работы под ожидаемой нагрузкой |
| **Stress** | За пределами нормы | Поиск точки отказа, предельной мощности |
| **Spike** | Резкие скачки | Реакция на внезапный всплеск трафика |
| **Soak** | Длительная нагрузка | Поиск утечек памяти, деградации со временем |

## 🛠️ Поддерживаемые инструменты

### k6 (рекомендуется)
- ✅ JavaScript/TypeScript сценарии
- ✅ Встроенные метрики и алерты
- ✅ Интеграция с Grafana/InfluxDB
- ✅ Distributed testing

### JMeter
- ✅ GUI для создания тестов
- ✅ Огромная экосистема плагинов
- ✅ Поддержка множества протоколов

### Gatling
- ✅ Scala/Kotlin/Java DSL
- ✅ Отличная производительность
- ✅ Детальные отчёты из коробки

## 📈 Пример отчёта

`performance.report.yml`:

```yaml
test_run:
  id: perf-2024-08-15-001
  date: 2024-08-15T14:30:00Z
  scenario: Checkout Flow
  type: load
  
results:
  total_requests: 180000
  passed: 179820
  failed: 180
  error_rate: 0.1%
  
latency:
  p50_ms: 120
  p90_ms: 280
  p95_ms: 450
  p99_ms: 890
  max_ms: 2500
  
throughput:
  rps_avg: 100
  rps_peak: 115
  
sla_compliance:
  p95_latency: ✅ PASS (450ms < 500ms)
  p99_latency: ❌ FAIL (890ms > 1000ms)
  error_rate: ✅ PASS (0.1% = 0.1%)
  
bottlenecks:
  - component: Database
    issue: Slow queries on checkout_items table
    recommendation: Add index on (order_id, status)
    
  - component: Payment Gateway
    issue: External API latency spikes
    recommendation: Implement circuit breaker pattern
    
summary: |
  Тест пройден частично. Основная проблема - p99 latency превышает целевое значение.
  Рекомендуется оптимизировать запросы к БД и добавить кэширование.
```

## 🎯 Best Practices

1. **Начинайте с baseline** — запустите тест на текущей версии, чтобы иметь точку отсчёта
2. **Тестируйте в изоляции** — используйте staging-окружение, близкое к продакшену
3. **Мониторьте всё** — CPU, память, диск, сеть, БД, внешние API
4. **Автоматизируйте** — интегрируйте в CI/CD пайплайн
5. **Сравнивайте** — каждый прогон сравнивайте с предыдущим

## 🔗 Интеграция с CI/CD

Пример GitHub Actions:

```yaml
name: Performance Tests

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 3 * * *' # Ежедневно в 03:00

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install k6
        run: sudo apt-get install -y k6
        
      - name: Run Performance Test
        run: npx @kiwi-tcms-ai/kiwi-tcms-skills kiwi-performance-testing --ci=true
        
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: performance-report
          path: performance.report.yml
          
      - name: Check SLA
        run: |
          if grep -q "SLA_COMPLIANCE: FAIL" performance.report.yml; then
            echo "::error::Performance SLA не выполнена!"
            exit 1
          fi
```

## ⚠️ Troubleshooting

| Проблема | Решение |
| --- | --- |
| Недостаточно ресурсов для нагрузки | Используйте distributed testing или облачные решения |
| Ложные срабатывания SLA | Увеличьте warm-up период, проверьте стабильность окружения |
| Результаты нестабильны | Запускайте тест 3-5 раз, берите медианное значение |
| Не хватает данных для теста | Используйте `kiwi-data-seeder` для генерации тестовых данных |

## 📚 Дополнительные ресурсы

- [Документация k6](https://k6.io/docs/)
- [JMeter User Manual](https://jmeter.apache.org/usermanual/index.html)
- [Gatling Documentation](https://gatling.io/docs/gatling/reference/current/)
- [Примеры в docs/examples.md](../../docs/examples.md#23-kiwi-performance-testing)

## 🆘 Помощь

- [Troubleshooting Guide](../../TROUBLESHOOTING.md)
- [Decision Tree](../../docs/DECISION-TREE.md)
- [Workflow Guide](../../.kiwi-workflow.yml)
