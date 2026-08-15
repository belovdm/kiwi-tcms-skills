# 🌳 Decision Tree: Какой скилл выбрать?

Этот документ помогает выбрать правильный скилл для вашей задачи. Следуйте вопросам ниже.

---

## 🔍 Быстрый выбор по сценарию

| Если вам нужно... | Используйте скилл |
| --- | --- |
| **Создать тест-кейсы из требований** | `kiwi-requirement-analyzer` → `kiwi-write-test-cases` |
| **Проверить требования на тестопригодность** | `kiwi-requirement-reviewer` |
| **Обновить кейсы по PR** | `kiwi-detect-changes-in-pr` + `kiwi-sync-test-cases` |
| **Найти дубликаты кейсов** | `kiwi-detect-duplicate-test-cases` |
| **Запустить исследовательское тестирование** | `kiwi-exploratory-testing-session` |
| **Посеять тестовые данные** | `kiwi-data-seeder` |
| **Разобрать падение автотеста** | `kiwi-debug-failed-autotest` или `kiwi-debug-failed-flaky-autotests` |
| **Найти дубликаты автотестов** | `kiwi-automation-consolidation` |
| **Просканировать проект автотестов** | `kiwi-scan-automation-project` |
| **Распределить тесты по уровням пирамиды** | `kiwi-split-testing-levels-pyramid` |
| **Сгенерировать отчёт за спринт** | `kiwi-sprint-report` |
| **Провести нагрузочное тестирование** | `kiwi-performance-testing` |
| **Проверить доступность (a11y)** | `kiwi-accessibility-testing` |
| **Проверить контракты API** | `kiwi-api-contract-testing` |
| **Оценить зрелость процессов** | `kiwi-assess-maturity-level` |
| **Спланировать улучшение процессов** | `kiwi-plan-process-improvement` |

---

## 🧭 Полное дерево решений

### 1️⃣ Работа с требованиями

```
Есть ли у вас требования/user stories?
├─ ДА → Нужно проверить их на тестопригодность?
│   ├─ ДА → kiwi-requirement-reviewer
│   └─ НЕТ → Нужно создать тест-кейсы?
│       ├─ ДА → kiwi-requirement-analyzer → kiwi-write-test-cases
│       └─ НЕТ → Нужен чек-лист проверок?
│           └─ kiwi-generate-checklist-from-requirements
└─ НЕТ → Перейти к разделу "Работа с кодом/PR"
```

### 2️⃣ Работа с кодом / Pull Request

```
Есть ли открытый PR?
├─ ДА → Нужно найти изменения в коде?
│   └─ kiwi-detect-changes-in-pr
│
│   После обнаружения изменений:
│   ├─ Нужно обновить тест-кейсы?
│   │   └─ kiwi-sync-test-cases
│   ├─ Нужно создать новые кейсы?
│   │   └─ kiwi-write-test-cases (с флагом --pr-context)
│   └─ Нужно запустить регресс?
│       └─ kiwi-select-tests-for-regression
│
└─ НЕТ → Перейти к разделу "Работа с тест-кейсами"
```

### 3️⃣ Работа с тест-кейсами

```
Что нужно сделать с тест-кейсами?
├─ Найти дубликаты
│   └─ kiwi-detect-duplicate-test-cases
├─ Обновить по изменениям в коде
│   └─ kiwi-sync-test-cases
├─ Создать новые
│   └─ kiwi-write-test-cases
├─ Запустить исследовательское тестирование
│   └─ kiwi-exploratory-testing-session
└─ Оценить покрытие
    └─ kiwi-assess-maturity-level (раздел Coverage)
```

### 4️⃣ Работа с автотестами

```
Что нужно сделать с автотестами?
├─ Разобрать падение
│   ├─ Единичное падение
│   │   └─ kiwi-debug-failed-autotest
│   └─ Массовые падения / поиск flaky
│       └─ kiwi-debug-failed-flaky-autotests
├─ Найти дубликаты
│   └─ kiwi-automation-consolidation
├─ Просканировать проект
│   └─ kiwi-scan-automation-project
└─ Распределить по уровням пирамиды
    └─ kiwi-split-testing-levels-pyramid
```

### 5️⃣ Специализированное тестирование

```
Какой тип тестирования нужен?
├─ Нагрузочное / Performance
│   ├─ Load test (плановая нагрузка)
│   ├─ Stress test (за пределами нормы)
│   ├─ Spike test (резкие скачки)
│   └─ Soak test (длительная нагрузка)
│       └─ kiwi-performance-testing
│
├─ Доступность (Accessibility / a11y)
│   ├─ Автоматическая проверка (axe-core)
│   ├─ Ручная проверка (клавиатура, скринридер)
│   └─ Отчёт по WCAG 2.1/2.2
│       └─ kiwi-accessibility-testing
│
├─ Контракты API
│   ├─ OpenAPI / Swagger
│   ├─ GraphQL Schema
│   ├─ Pact (Consumer-Driven Contracts)
│   └─ Поиск breaking changes
│       └─ kiwi-api-contract-testing
│
├─ Безопасность (Security)
│   └─ [Планируется] kiwi-security-scan
│
└─ Мобильное тестирование
    └─ [Планируется] kiwi-mobile-testing
```

### 6️⃣ Отчётность и аналитика

```
Что нужно получить?
├─ Отчёт за спринт
│   └─ kiwi-sprint-report
├─ Оценка зрелости процессов
│   └─ kiwi-assess-maturity-level
├─ План улучшений
│   └─ kiwi-plan-process-improvement
└─ Тестовые данные
    └─ kiwi-data-seeder
```

---

## 🎯 Сценарии использования

### Сценарий 1: Новый фича-реквест
1. `kiwi-requirement-reviewer` — проверка требований
2. `kiwi-requirement-analyzer` — извлечение тестовых сценариев
3. `kiwi-write-test-cases` — создание кейсов в Kiwi TCMS
4. `kiwi-generate-checklist-from-requirements` — чек-лист для смоук-теста

### Сценарий 2: Code Review PR
1. `kiwi-detect-changes-in-pr` — анализ диффа
2. `kiwi-sync-test-cases` — обновление существующих кейсов
3. `kiwi-select-tests-for-regression` — выборка на регресс
4. (Опционально) `kiwi-write-test-cases --pr-context` — новые кейсы

### Сценарий 3: Расследование инцидента
1. `kiwi-debug-failed-flaky-autotests` — классификация падений
2. `kiwi-detect-duplicate-test-cases` — поиск дублей (возможно причина нестабильности)
3. `kiwi-automation-consolidation` — консолидация автотестов

### Сценарий 4: Подготовка к релизу
1. `kiwi-performance-testing` — нагрузочное тестирование
2. `kiwi-accessibility-testing` — проверка доступности
3. `kiwi-api-contract-testing` — валидация контрактов API
4. `kiwi-sprint-report` — итоговый отчёт

### Сценарий 5: Аудит качества
1. `kiwi-assess-maturity-level` — оценка зрелости L1-L5
2. `kiwi-scan-automation-project` — инвентаризация автотестов
3. `kiwi-plan-process-improvement` — план улучшений

---

## 📊 Матрица ответственности скиллов

| Область | Скиллы | Артефакты |
| --- | --- | --- |
| **Requirements** | `kiwi-requirement-reviewer`, `kiwi-requirement-analyzer` | `requirements.analysis.yml` |
| **Test Design** | `kiwi-write-test-cases`, `kiwi-generate-checklist-from-requirements` | Тест-кейсы в Kiwi TCMS |
| **Change Detection** | `kiwi-detect-changes-in-pr` | `pr.changes.yml` |
| **Sync & Update** | `kiwi-sync-test-cases` | Обновлённые кейсы |
| **Deduplication** | `kiwi-detect-duplicate-test-cases`, `kiwi-automation-consolidation` | `duplicates.report.yml` |
| **Debugging** | `kiwi-debug-failed-autotest`, `kiwi-debug-failed-flaky-autotests` | `root-cause.analysis.yml` |
| **Inventory** | `kiwi-scan-automation-project` | `automation-inventory.yml` |
| **Pyramid** | `kiwi-split-testing-levels-pyramid` | `testing-pyramid.yml` |
| **Performance** | `kiwi-performance-testing` | `performance.report.yml` |
| **Accessibility** | `kiwi-accessibility-testing` | `a11y.report.yml` |
| **Contracts** | `kiwi-api-contract-testing` | `contract.validation.yml` |
| **Reporting** | `kiwi-sprint-report` | `sprint.qa.report.yml` |
| **Maturity** | `kiwi-assess-maturity-level`, `kiwi-plan-process-improvement` | `maturity.assessment.yml` |

---

## ❓ FAQ

**Q: Чем отличается `kiwi-debug-failed-autotest` от `kiwi-debug-failed-flaky-autotests`?**  
A: Первый — для разбора единичного падения. Второй — для массового анализа и поиска flaky-тестов.

**Q: Когда использовать `kiwi-sync-test-cases`, а когда `kiwi-write-test-cases`?**  
A: `sync` — для обновления существующих кейсов по изменениям в коде. `write` — для создания новых кейсов с нуля.

**Q: Можно ли пропустить оценку требований и сразу писать кейсы?**  
A: Технически да, но не рекомендуется. `kiwi-requirement-reviewer` помогает найти проблемы до начала работы.

**Q: Какие инструменты используются для performance testing?**  
A: k6, JMeter, Gatling (настраивается в параметрах скилла).

**Q: Поддерживается ли мобильное тестирование?**  
A: Пока нет. В планах `kiwi-mobile-testing` для iOS/Android.

---

## 🔗 Ссылки

- [Все примеры использования](./examples.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Установка и настройка](./install-details.md)
