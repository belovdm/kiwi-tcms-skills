# ♿ Kiwi Accessibility Testing Skill

Быстрый старт для тестирования доступности (a11y) с помощью `kiwi-accessibility-testing`.

## 📋 Что делает скилл

- Проверяет соответствие WCAG 2.1/2.2 (уровни A, AA, AAA)
- Запускает автоматические проверки через axe-core
- Организует ручное тестирование (клавиатура, скринридеры)
- Создаёт отчёт `a11y.report.yml` с нарушениями и рекомендациями
- Приоритизирует исправления по влиянию на пользователей

## 🔧 Быстрый старт

### 1. Базовая проверка одной страницы

```bash
npx @kiwi-tcms-ai/kiwi-tcms-skills kiwi-accessibility-testing --url=https://example.com
```

**Выходные данные:**
- `a11y.report.yml` со списком нарушений
- Рекомендации по исправлению
- Оценка соответствия WCAG

### 2. Проверка нескольких страниц

Создайте файл `a11y-config.yml`:

```yaml
urls:
  - https://example.com/
  - https://example.com/products
  - https://example.com/checkout
  - https://example.com/login
  
wcag_level: AA
tools:
  - axe-core
  - manual
  
manual_tests:
  - keyboard_navigation
  - screen_reader
  - color_contrast
  - focus_indicators
  
priority: critical # critical | high | medium | low
```

Запустите:

```bash
npx @kiwi-tcms-ai/kiwi-tcms-skills kiwi-accessibility-testing --config=a11y-config.yml
```

## 📊 Уровни WCAG 2.1/2.2

| Уровень | Описание | Кому подходит |
| --- | --- | --- |
| **A** | Минимальный уровень доступности | Базовое соответствие |
| **AA** | Рекомендуемый уровень (цель для большинства) | **Целевой для проектов** |
| **AAA** | Максимальный уровень | Специализированные проекты |

## 🛠️ Методы тестирования

### Автоматическое (axe-core)

✅ **Что проверяет:**
- Missing alt text
- Color contrast
- Form labels
- ARIA attributes
- Heading structure
- Link names

❌ **Что НЕ проверяет:**
- Логический порядок фокуса
- Осмысленность alt текста
- Доступность контента для скринридеров

### Ручное тестирование

#### 1. Навигация с клавиатуры
- Tab / Shift+Tab — переключение между элементами
- Enter / Space — активация кнопок и ссылок
- Arrow keys — навигация в меню и виджетах
- Esc — закрытие модальных окон

#### 2. Скринридеры
- **NVDA** (Windows, бесплатно)
- **VoiceOver** (macOS/iOS, встроенный)
- **JAWS** (Windows, платный)
- **TalkBack** (Android)

#### 3. Проверка контраста
- Используйте [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Минимальные требования:
  - Обычный текст: 4.5:1 (AA), 7:1 (AAA)
  - Крупный текст: 3:1 (AA), 4.5:1 (AAA)

## 📈 Пример отчёта

`a11y.report.yml`:

```yaml
audit:
  id: a11y-2024-08-15-001
  date: 2024-08-15T10:00:00Z
  urls_tested: 4
  wcag_target: AA
  
summary:
  total_issues: 23
  critical: 3
  high: 8
  medium: 9
  low: 3
  
  compliance_score: 72% # Цель: >95%
  
violations:
  - id: color-contrast
    wcag: 1.4.3
    level: AA
    severity: critical
    count: 12
    description: Элементы имеют недостаточный контраст
    affected_elements:
      - ".btn-secondary" (8 instances)
      - ".text-muted" (4 instances)
    recommendation: |
      Измените цвета для достижения контраста минимум 4.5:1
      Используйте инструмент WebAIM Contrast Checker
      
  - id: missing-alt-text
    wcag: 1.1.1
    level: A
    severity: high
    count: 5
    description: Изображения без альтернативного текста
    affected_elements:
      - "img.product-thumbnail" (5 instances)
    recommendation: |
      Добавьте атрибут alt для всех изображений
      Для декоративных изображений используйте alt=""
      
  - id: keyboard-trap
    wcag: 2.1.2
    level: A
    severity: critical
    count: 1
    description: Модальное окно не закрывается с клавиатуры
    affected_elements:
      - "#promo-modal"
    recommendation: |
      Добавьте обработчик Event.key === 'Escape'
      Убедитесь, что фокус возвращается на триггер
      
manual_findings:
  keyboard:
    - issue: Невозможно добраться до футера
      page: /checkout
      severity: high
      
  screen_reader:
    - issue: Форма оплаты не озвучивается корректно
      page: /checkout
      severity: critical
      
prioritized_actions:
  - priority: 1
    action: Исправить keyboard trap в модальном окне
    effort: low
    impact: critical
    
  - priority: 2
    action: Добавить alt text к изображениям товаров
    effort: low
    impact: high
    
  - priority: 3
    action: Улучшить контраст вторичных кнопок
    effort: medium
    impact: critical
```

## 🎯 Чек-лист быстрой проверки

### Критические (должны быть исправлены немедленно)
- [ ] Все интерактивные элементы доступны с клавиатуры
- [ ] Нет keyboard traps
- [ ] Формы имеют label или aria-label
- [ ] Ошибки форм озвучиваются скринридерам
- [ ] Контраст текста минимум 4.5:1

### Важные (исправить в ближайшем спринте)
- [ ] Все изображения имеют alt text
- [ ] Заголовки идут в логическом порядке (h1 → h6)
- [ ] Ссылки имеют осмысленные названия
- [ ] Фокус виден на всех элементах
- [ ] Модальные окна закрываются по Esc

### Желательные (улучшения)
- [ ] Skip link для перехода к основному контенту
- [ ] ARIA landmarks (main, nav, aside, footer)
- [ ] Breadcrumbs для навигации
- [ ] Понятные сообщения об ошибках

## 🔗 Интеграция с CI/CD

Пример GitHub Actions:

```yaml
name: Accessibility Tests

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 4 * * 1' # Еженедельно по понедельникам

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Start Server
        run: npm start &
        
      - name: Wait for Server
        run: sleep 10
        
      - name: Run Accessibility Test
        run: npx @kiwi-tcms-ai/kiwi-tcms-skills kiwi-accessibility-testing --ci=true
        
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: a11y-report
          path: a11y.report.yml
          
      - name: Check Critical Issues
        run: |
          if grep -q "critical: [1-9]" a11y.report.yml; then
            echo "::error::Найдены критические нарушения доступности!"
            exit 1
          fi
```

### Интеграция с Playwright/Cypress

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  tests: {
    accessibility: {
      // Интеграция с axe-core
      test('should pass accessibility checks', async ({ page }) => {
        await page.goto('https://example.com');
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
      });
    }
  }
});
```

## ⚠️ Troubleshooting

| Проблема | Решение |
| --- | --- |
 | Ложные срабатывания axe-core | Проверьте вручную, некоторые правила требуют контекста |
| Скринридер не читает динамический контент | Используйте aria-live regions |
| Фокус пропадает при обновлении контента | Управляйте фокусом программно (focus()) |
| Контраст проходит в инструментах, но не визуально | Проверьте градиенты и фоновые изображения |

## 📚 Инструменты

### Автоматизация
- **axe-core** — библиотека для автоматических проверок
- **Lighthouse** — аудит производительности и доступности
- **WAVE** — браузерное расширение для визуализации проблем

### Скринридеры
- **NVDA** (Windows) — [скачать](https://www.nvaccess.org/download/)
- **VoiceOver** (macOS) — Cmd+F5
- **JAWS** (Windows) — [пробная версия](https://www.freedomscientific.com/products/software/jaws/)

### Проверка контраста
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

## 📚 Дополнительные ресурсы

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Примеры в docs/examples.md](../../docs/examples.md#24-kiwi-accessibility-testing)

## 🆘 Помощь

- [Troubleshooting Guide](../../TROUBLESHOOTING.md)
- [Decision Tree](../../docs/DECISION-TREE.md)
- [Workflow Guide](../../.kiwi-workflow.yml)
