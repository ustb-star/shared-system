#!/usr/bin/env python3
"""Analyze Skill usage records from the shared-system usage log."""

import argparse
import json
import os
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path


DEFAULT_SHARED_SYSTEM_ROOT = Path(__file__).resolve().parents[3]
SHARED_SYSTEM_ROOT = Path(os.environ.get("SHARED_SYSTEM_ROOT", DEFAULT_SHARED_SYSTEM_ROOT))
LOG_FILE = SHARED_SYSTEM_ROOT / "skill-usage" / "skill_usage_log.jsonl"


def load_logs(days: int = 7) -> list[dict]:
    if not LOG_FILE.exists():
        print(f"日志文件不存在：{LOG_FILE}")
        print("请先用 skill-logger 记录几次使用。")
        return []

    cutoff = datetime.now() - timedelta(days=days)
    records = []

    with LOG_FILE.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            data = json.loads(line)
            if data.get("_schema"):
                continue
            record_date = datetime.strptime(data["date"], "%Y-%m-%d")
            if record_date >= cutoff:
                records.append(data)

    return records


def analyze(records: list[dict], days: int) -> None:
    if not records:
        print(f"最近 {days} 天没有使用记录。")
        return

    skill_count = defaultdict(int)
    skill_satisfaction = defaultdict(list)
    skill_notes = defaultdict(list)

    for record in records:
        skill = record["skill"]
        skill_count[skill] += 1
        skill_satisfaction[skill].append(record["satisfaction"])
        if record.get("note"):
            skill_notes[skill].append(record["note"])

    total_uses = len(records)
    unique_skills = len(skill_count)
    all_scores = [record["satisfaction"] for record in records]
    avg_overall = sum(all_scores) / len(all_scores)

    print(f"\n{'=' * 50}")
    print(f"Skill 使用分析（最近 {days} 天）")
    print(f"{'=' * 50}")
    print("\n总览")
    print(f"  共使用 {total_uses} 次，覆盖 {unique_skills} 个不同 Skill")
    print(f"  整体平均满意度：{avg_overall:.1f} / 5")

    print("\n使用频率排行")
    print(f"  {'排名':<4} {'Skill':<25} {'次数':<6} {'平均满意度'}")
    print(f"  {'-' * 50}")
    sorted_skills = sorted(skill_count.items(), key=lambda item: item[1], reverse=True)
    for index, (skill, count) in enumerate(sorted_skills, 1):
        avg = sum(skill_satisfaction[skill]) / len(skill_satisfaction[skill])
        print(f"  {index:<4} {skill:<25} {count:<6} {avg:.1f}")

    low_satisfaction = [
        (skill, sum(scores) / len(scores), skill_notes[skill])
        for skill, scores in skill_satisfaction.items()
        if sum(scores) / len(scores) < 3.5
    ]
    if low_satisfaction:
        print("\n满意度偏低的 Skill（< 3.5 分）")
        for skill, avg, notes in sorted(low_satisfaction, key=lambda item: item[1]):
            print(f"  {skill}：{avg:.1f} 分")
            if notes:
                print(f"    常见备注：{notes[-1]}")

    high_freq = [(skill, count) for skill, count in sorted_skills if count >= 5]
    if high_freq:
        print("\n高频 Skill（>=5 次），考虑自动化")
        for skill, count in high_freq:
            print(f"  {skill}（{count} 次）")

    print(f"\n{'=' * 50}")
    print(f"数据来源：{LOG_FILE}")
    print(f"{'=' * 50}\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="分析 Skill 使用日志")
    parser.add_argument("--days", type=int, default=7, help="分析最近 N 天，默认 7")
    args = parser.parse_args()

    records = load_logs(args.days)
    analyze(records, args.days)


if __name__ == "__main__":
    main()
