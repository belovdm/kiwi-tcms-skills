#!/usr/bin/env ts-node
/**
 * Валидатор структуры скиллов для @kiwi-tcms-ai/kiwi-tcms-skills
 * 
 * Проверяет:
 * - Наличие обязательных файлов (SKILL.md)
 * - Корректность front-matter в SKILL.md
 * - Отсутствие битых относительных ссылок
 * - Консистентность именования (kiwi-{verb}-{noun})
 * - Отсутствие дублирования скиллов между плагинами
 */

import * as fs from 'fs';
import * as path from 'path';

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const PLUGINS_DIR = path.join(__dirname, '..', 'plugins');

interface ValidationResult {
  file: string;
  status: 'pass' | 'warn' | 'error';
  message: string;
}

interface SkillMetadata {
  name: string;
  description: string;
  path: string;
}

// Regex для проверки именования скиллов
const SKILL_NAME_PATTERN = /^kiwi-[a-z]+(-[a-z]+)*$/;

// Обязательные файлы в каждом скилле
const REQUIRED_FILES = ['SKILL.md'];

// Извлекаем front-matter из Markdown
function extractFrontMatter(content: string): Record<string, string> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const frontmatter: Record<string, string> = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
  }
  
  return frontmatter;
}

// Находим все относительные ссылки в Markdown
function findRelativeLinks(content: string): string[] {
  const linkPattern = /\[([^\]]+)\]\(\.\.?\/[^)]+\)/g;
  const links: string[] = [];
  let match;
  
  while ((match = linkPattern.exec(content)) !== null) {
    links.push(match[0]);
  }
  
  return links;
}

// Проверяем существование файла по относительному пути
function checkRelativeLink(link: string, skillDir: string): boolean {
  const pathMatch = link.match(/\(([^)]+)\)/);
  if (!pathMatch) return true;

  let relativePath = pathMatch[1];
  
  // Игнорируем якоря (#anchor) при проверке существования файла
  if (relativePath.includes('#')) {
    relativePath = relativePath.split('#')[0];
  }
  
  // Пустой путь после удаления якоря — это текущий файл
  if (!relativePath) return true;

  const absolutePath = path.resolve(skillDir, relativePath);

  return fs.existsSync(absolutePath);
}

// Собираем все скиллы из директории
function collectSkills(dir: string): SkillMetadata[] {
  const skills: SkillMetadata[] = [];
  
  if (!fs.existsSync(dir)) return skills;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    
    const skillPath = path.join(dir, entry.name);
    const skillFile = path.join(skillPath, 'SKILL.md');
    
    if (!fs.existsSync(skillFile)) continue;
    
    const content = fs.readFileSync(skillFile, 'utf-8');
    const frontmatter = extractFrontMatter(content);
    
    if (frontmatter?.name) {
      skills.push({
        name: frontmatter.name,
        description: frontmatter.description || '',
        path: skillPath
      });
    }
  }
  
  return skills;
}

// Основная функция валидации
function validate(): void {
  const results: ValidationResult[] = [];
  const allSkillNames: Map<string, string[]> = new Map();
  
  console.log('🔍 Валидация скиллов...\n');
  
  // 1. Валидация основных скиллов
  console.log('📁 Проверка основных скиллов...');
  const mainSkills = collectSkills(SKILLS_DIR);
  
  for (const skill of mainSkills) {
    // Проверка именования
    if (!SKILL_NAME_PATTERN.test(skill.name)) {
      results.push({
        file: skill.path,
        status: 'error',
        message: `Некорректное имя скилла: "${skill.name}". Ожидается формат kiwi-{verb}-{noun}`
      });
    }
    
    // Трекинг дубликатов
    if (!allSkillNames.has(skill.name)) {
      allSkillNames.set(skill.name, []);
    }
    allSkillNames.get(skill.name)!.push(skill.path);
    
    // Проверка наличия обязательных файлов
    const skillDir = skill.path;
    for (const requiredFile of REQUIRED_FILES) {
      const filePath = path.join(skillDir, requiredFile);
      if (!fs.existsSync(filePath)) {
        results.push({
          file: skill.path,
          status: 'error',
          message: `Отсутствует обязательный файл: ${requiredFile}`
        });
      }
    }
    
    // Проверка front-matter
    const skillFile = path.join(skillDir, 'SKILL.md');
    const content = fs.readFileSync(skillFile, 'utf-8');
    const frontmatter = extractFrontMatter(content);
    
    if (!frontmatter) {
      results.push({
        file: skillFile,
        status: 'error',
        message: 'Отсутствует front-matter (блок ---)'
      });
    } else if (!frontmatter.name) {
      results.push({
        file: skillFile,
        status: 'error',
        message: 'Отсутствует поле "name" в front-matter'
      });
    } else if (!frontmatter.description) {
      results.push({
        file: skillFile,
        status: 'warn',
        message: 'Отсутствует поле "description" в front-matter'
      });
    }
    
    // Проверка относительных ссылок
    const links = findRelativeLinks(content);
    for (const link of links) {
      if (!checkRelativeLink(link, skillDir)) {
        results.push({
          file: skillFile,
          status: 'error',
          message: `Битая ссылка: ${link}`
        });
      }
    }
  }
  
  // 2. Проверка плагинов на дублирование скиллов
  console.log('🔌 Проверка плагинов...');
  const pluginDirs = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true });
  
  for (const entry of pluginDirs) {
    if (!entry.isDirectory()) continue;
    
    const pluginPath = path.join(PLUGINS_DIR, entry.name);
    const pluginSkillsPath = path.join(pluginPath, 'skills');
    
    if (!fs.existsSync(pluginSkillsPath)) continue;
    
    const pluginSkills = collectSkills(pluginSkillsPath);
    
    for (const skill of pluginSkills) {
      if (!allSkillNames.has(skill.name)) {
        allSkillNames.set(skill.name, []);
      }
      allSkillNames.get(skill.name)!.push(skill.path);
    }
  }
  
  // Отчёт о дубликатах
  for (const [skillName, paths] of allSkillNames.entries()) {
    if (paths.length > 1) {
      results.push({
        file: skillName,
        status: 'warn',
        message: `Скилл дублируется в ${paths.length} местах: ${paths.map(p => path.relative(__dirname, p)).join(', ')}`
      });
    }
  }
  
  // Вывод результатов
  console.log('\n' + '='.repeat(80));
  console.log('РЕЗУЛЬТАТЫ ВАЛИДАЦИИ:\n');
  
  const errors = results.filter(r => r.status === 'error');
  const warnings = results.filter(r => r.status === 'warn');
  const passed = results.filter(r => r.status === 'pass');
  
  if (errors.length > 0) {
    console.log(`❌ ОШИБКИ (${errors.length}):`);
    for (const error of errors) {
      console.log(`  • ${error.file}: ${error.message}`);
    }
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log(`⚠️  ПРЕДУПРЕЖДЕНИЯ (${warnings.length}):`);
    for (const warning of warnings) {
      console.log(`  • ${warning.file}: ${warning.message}`);
    }
    console.log('');
  }
  
  console.log('='.repeat(80));
  console.log(`Всего проверено: ${results.length}`);
  console.log(`✅ Passed: ${results.length - errors.length - warnings.length}`);
  console.log(`⚠️  Warnings: ${warnings.length}`);
  console.log(`❌ Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ ВАЛИДАЦИЯ НЕ ПРОЙДЕНА');
    process.exit(1);
  } else {
    console.log('\n✅ ВАЛИДАЦИЯ ПРОЙДЕНА');
    process.exit(0);
  }
}

// Запуск
validate();
