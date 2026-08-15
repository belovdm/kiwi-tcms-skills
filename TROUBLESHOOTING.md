# Troubleshooting MCP Skills for Kiwi TCMS

Частые ошибки и способы их решения при работе со скиллами @kiwi-tcms-ai/kiwi-tcms-skills.

## Top-10 ошибок MCP

### 1. «MCP server not found: kiwi-tcms-mcp»
**Причина:** MCP сервер не установлен или не настроен в клиенте.  
**Решение:** 
```bash
npm install -g @kiwi-tcms-ai/kiwi-tcms-mcp
```
Добавьте в конфиг MCP клиента (Claude Desktop, Cline, Roo Code):
```json
{
  "mcpServers": {
    "kiwi-tcms-mcp": {
      "command": "kiwi-tcms-mcp",
      "args": []
    }
  }
}
```

### 2. «kiwi_ping failed»
**Причина:** Неверные учётные данные или сеть.  
**Решение:** Проверьте переменные окружения:
- `KIWI_URL` — адрес вашего Kiwi TCMS
- `KIWI_USERNAME` — логин
- `KIWI_PASSWORD` — пароль или API token
- `KIWI_PROJECT` — название проекта (plan)

Запустите тестовый ping через MCP client.

### 3. «Case TC-XXX not found»
**Причина:** Case был удалён из Kiwi или ID указан неверно.  
**Решение:** Используйте `kiwi_search_cases(query: <summary>)` для поиска актуального ID.

### 4. «Cannot create case: plan not found»
**Причина:** План тестирования не существует в Kiwi.  
**Решение:** Сначала создайте план через `kiwi_create_plan(name, type, text)` или выберите существующий через `kiwi_list_plans`.

### 5. «Duplicate test cases detected»
**Причина:** В Kiwi уже есть кейс с таким summary.  
**Решение:** Перед созданием всегда делайте `kiwi_search_cases(query: <summary>)`. Если найден один кейс — привяжите его к локальному файлу (добавьте `TC-<id>` в заголовок).

### 6. «Bitая ссылка на reference-файл»
**Причина:** При установке через `npx skills add` относительные пути могут сломаться.  
**Решение:** Проверяйте ссылки в SKILL.md. Используйте абсолютные пути внутри пакета или копируйте reference-файлы вместе со скиллом.

### 7. «Скилл не выполняется, хотя установлен»
**Причина:** Конфликт имён или триггеров между скиллами.  
**Решение:** Посмотрите логи MCP клиента. Убедитесь, что запрос соответствует описанию скилла (description в front-matter).

### 8. «Reporter не отправляет результаты в Kiwi»
**Причина:** Не установлены переменные окружения или неверный формат тегов.  
**Решение:** 
- Проверьте `KIWI_*` переменные в CI
- Теги должны быть `C412`, `TC-412`, `KIWI:412` или `[C412]`
- Запустите сначала с `--dry-run`

### 9. «Синхронизация удалила кейсы из Kiwi»
**Причина:** Ошибка в скрипте синхронизации.  
**Решение:** **Никогда не удаляйте кейсы из Kiwi автоматически.** Скиллы `kiwi-sync-test-cases` только создают/обновляют, но не удаляют.

### 10. «Валидация скиллов не пройдена»
**Причина:** Нарушена структура (нет SKILL.md, битые ссылки, неверное имя).  
**Решение:** Запустите `npx tsx scripts/validate-skills.ts` и исправьте указанные ошибки.

---

## Диагностика

### Проверка установки скиллов
```bash
ls -la node_modules/@kiwi-tcms-ai/kiwi-tcms-skills/skills/
```

### Проверка валидности
```bash
npx tsx scripts/validate-skills.ts
```

### Логи MCP
Смотрите в клиенте (Claude Desktop: Dev Tools → Console, Cline: Output panel).

---

## Обратная связь

Нашли ошибку? Откройте issue в репозитории @kiwi-tcms-ai/kiwi-tcms-skills.
