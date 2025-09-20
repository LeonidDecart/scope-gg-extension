#!/usr/bin/env python3
"""
Scope.gg Video Processor
Скрипт для скачивания и объединения видео из компиляций scope.gg
"""

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import List, Dict, Any
import tempfile

def print_banner():
    """Выводит баннер программы"""
    print("=" * 60)
    print("🎬 Scope.gg Video Processor")
    print("=" * 60)
    print("Скрипт для скачивания и объединения видео из компиляций")
    print("=" * 60)

def get_json_from_user() -> Dict[str, Any]:
    """Получает JSON данные от пользователя"""
    print("\n📋 Введите JSON данные, скопированные из расширения:")
    print("Варианты завершения ввода:")
    print("1. Введите пустую строку (просто нажмите Enter)")
    print("2. Нажмите Ctrl+D (Mac/Linux) или Ctrl+Z (Windows)")
    print("-" * 60)
    
    lines = []
    try:
        while True:
            line = input()
            if line.strip() == "":  # Пустая строка завершает ввод
                break
            lines.append(line)
    except EOFError:
        pass
    
    json_text = '\n'.join(lines).strip()
    
    if not json_text:
        print("❌ Не введены данные")
        sys.exit(1)
    
    try:
        data = json.loads(json_text)
        return data
    except json.JSONDecodeError as e:
        print(f"❌ Ошибка парсинга JSON: {e}")
        sys.exit(1)

def download_video(url: str, filename: str) -> bool:
    """Скачивает видео по URL"""
    print(f"⬇️  Скачиваю: {filename}")
    
    try:
        # Используем wget для скачивания
        result = subprocess.run([
            'wget', '--quiet', '--show-progress', 
            '--output-document', filename, url
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ Успешно скачано: {filename}")
            return True
        else:
            print(f"❌ Ошибка скачивания {filename}: {result.stderr}")
            return False
            
    except FileNotFoundError:
        print("❌ wget не найден. Попробуем использовать curl...")
        try:
            result = subprocess.run([
                'curl', '--silent', '--show-error',
                '--output', filename, url
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ Успешно скачано: {filename}")
                return True
            else:
                print(f"❌ Ошибка скачивания {filename}: {result.stderr}")
                return False
        except FileNotFoundError:
            print("❌ Ни wget, ни curl не найдены. Установите один из них.")
            return False

def trim_video(input_file: str, output_file: str) -> bool:
    """Обрезает последние 7 секунд из видео"""
    print(f"✂️  Обрезаю последние 7 секунды: {input_file}")
    
    try:
        # Получаем длительность видео
        duration_cmd = [
            'ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1', input_file
        ]
        
        result = subprocess.run(duration_cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"❌ Ошибка получения длительности видео: {result.stderr}")
            return False
        
        try:
            total_duration = float(result.stdout.strip())
        except ValueError:
            print(f"❌ Не удалось определить длительность видео")
            return False
        
        # Вычисляем новую длительность (минус 7 секунд)
        new_duration = max(0, total_duration - 7)
        
        if new_duration <= 0:
            print(f"⚠️  Видео слишком короткое для обрезки")
            # Копируем файл как есть
            subprocess.run(['cp', input_file, output_file], check=True)
        else:
            # Обрезаем видео
            trim_cmd = [
                'ffmpeg', '-y', '-i', input_file,
                '-t', str(new_duration),
                '-c', 'copy', output_file
            ]
            
            result = subprocess.run(trim_cmd, capture_output=True, text=True)
            if result.returncode != 0:
                print(f"❌ Ошибка обрезки видео: {result.stderr}")
                return False
        
        print(f"✅ Видео обрезано: {output_file}")
        return True
        
    except FileNotFoundError:
        print("❌ ffmpeg не найден. Установите ffmpeg для работы с видео.")
        return False

def concat_videos(input_files: List[str], output_file: str) -> bool:
    """Объединяет несколько видео в одно"""
    print(f"🔗 Объединяю {len(input_files)} видео в {output_file}")
    
    try:
        # Создаем временный файл со списком видео
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            for input_file in input_files:
                f.write(f"file '{os.path.abspath(input_file)}'\n")
            concat_list_file = f.name
        
        # Команда для объединения видео
        concat_cmd = [
            'ffmpeg', '-y', '-f', 'concat', '-safe', '0',
            '-i', concat_list_file,
            '-c', 'copy', output_file
        ]
        
        result = subprocess.run(concat_cmd, capture_output=True, text=True)
        
        # Удаляем временный файл
        os.unlink(concat_list_file)
        
        if result.returncode == 0:
            print(f"✅ Видео успешно объединены: {output_file}")
            return True
        else:
            print(f"❌ Ошибка объединения видео: {result.stderr}")
            return False
            
    except FileNotFoundError:
        print("❌ ffmpeg не найден. Установите ffmpeg для работы с видео.")
        return False

def main():
    """Основная функция"""
    print_banner()
    
    # Получаем JSON данные
    data = get_json_from_user()
    
    # Проверяем структуру данных
    if 'clips' not in data or 'povType' not in data:
        print("❌ Неверный формат JSON. Ожидается объект с полями 'clips' и 'povType'")
        sys.exit(1)
    
    clips = data['clips']
    pov_type = data['povType']
    
    if not clips:
        print("❌ Нет клипов для обработки")
        sys.exit(1)
    
    print(f"\n📊 Найдено {len(clips)} клипов ({pov_type})")
    
    # Создаем директорию для работы
    work_dir = Path(f"scope_compilation_{pov_type.replace(' ', '_').lower()}")
    work_dir.mkdir(exist_ok=True)
    
    print(f"📁 Рабочая директория: {work_dir}")
    
    # Скачиваем видео
    downloaded_files = []
    trimmed_files = []
    
    for i, clip in enumerate(clips, 1):
        order = clip.get('order', i)
        clip_id = clip['clipId']
        url = clip['url']
        title = clip.get('title', f'clip_{clip_id}')
        
        print(f"\n🎬 Обрабатываю клип {order}/{len(clips)}: {title}")
        
        # Скачиваем видео
        downloaded_file = work_dir / f"downloaded_{order:02d}_{clip_id}.mp4"
        if not download_video(url, str(downloaded_file)):
            print(f"⚠️  Пропускаю клип {order}")
            continue
        
        downloaded_files.append(downloaded_file)
        
        # Обрезаем видео (убираем последние 7 секунд)
        trimmed_file = work_dir / f"trimmed_{order:02d}_{clip_id}.mp4"
        if trim_video(str(downloaded_file), str(trimmed_file)):
            trimmed_files.append(trimmed_file)
        else:
            print(f"⚠️  Использую оригинальное видео для клипа {order}")
            trimmed_files.append(downloaded_file)
    
    if not trimmed_files:
        print("❌ Не удалось скачать ни одного видео")
        sys.exit(1)
    
    # Объединяем видео
    output_filename = work_dir / f"final_compilation_{pov_type.replace(' ', '_').lower()}.mp4"
    
    if len(trimmed_files) == 1:
        # Если только одно видео, просто переименовываем
        os.rename(trimmed_files[0], output_filename)
        print(f"✅ Финальное видео: {output_filename}")
    else:
        # Объединяем несколько видео
        if concat_videos([str(f) for f in trimmed_files], str(output_filename)):
            print(f"✅ Финальное видео: {output_filename}")
        else:
            print("❌ Ошибка объединения видео")
            sys.exit(1)
    
    # Очищаем временные файлы
    print(f"\n🧹 Очищаю временные файлы...")
    for temp_file in downloaded_files + trimmed_files:
        if temp_file.exists() and temp_file != output_filename:
            temp_file.unlink()
    
    print(f"\n🎉 Готово! Финальное видео: {output_filename}")
    print(f"📁 Все файлы находятся в директории: {work_dir}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹️  Операция прервана пользователем")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Неожиданная ошибка: {e}")
        sys.exit(1)
