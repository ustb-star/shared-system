#!/usr/bin/env python3
"""Record one Skill usage event to the shared-system usage log."""

import argparse
import json
import os
from datetime import datetime
from pathlib import Path


DEFAULT_SHARED_SYSTEM_ROOT = Path(__file__).resolve().parents[3]
SHARED_SYSTEM_ROOT = Path(os.environ.get("SHARED_SYSTEM_ROOT", DEFAULT_SHARED_SYSTEM_ROOT))
LOG_FILE = SHARED_SYSTEM_ROOT / "skill-usage" / "skill_usage_log.jsonl"

WEEKDAY_MAP = {
    0: "周一",
    1: "周二",
    2: "周三",
    3: "周四",
    4: "周五",
    5: "周六",
    6: "周日",
}


def get_week_number(dt: datetime) -> str:
    return f"W{dt.isocalendar()[1]:02d}"


def ensure_log_file() -> None:
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    if LOG_FILE.exists():
        return

    schema = {
        "_schema": "skill_usage_log",
        "_version": "1.0",
        "_description": "Skill 使用日志。每次使用 Skill 后追加一条记录，用于频率分析和满意度追踪。",
    }
    LOG_FILE.write_text(json.dumps(schema, ensure_ascii=False) + "\n", encoding="utf-8")


def append_log(skill: str, scene: str, satisfaction: int, note: str = "") -> dict:
    now = datetime.now()
    record = {
        "date": now.strftime("%Y-%m-%d"),
        "weekday": WEEKDAY_MAP[now.weekday()],
        "week": get_week_number(now),
        "skill": skill,
        "scene": scene,
        "satisfaction": int(satisfaction),
        "note": note,
    }

    ensure_log_file()
    with LOG_FILE.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

    return record


def main() -> None:
    parser = argparse.ArgumentParser(description="记录 Skill 使用日志")
    parser.add_argument("--skill", required=True, help="Skill 名称，如 x-post")
    parser.add_argument("--scene", required=True, help="使用场景描述")
    parser.add_argument(
        "--satisfaction",
        required=True,
        type=int,
        choices=range(1, 6),
        help="满意度 1-5",
    )
    parser.add_argument("--note", default="", help="备注，可选")
    args = parser.parse_args()

    record = append_log(args.skill, args.scene, args.satisfaction, args.note)

    print(f"已记录：{record['skill']}（满意度 {record['satisfaction']}/5）")
    print(f"场景：{record['scene']}")
    if record["note"]:
        print(f"备注：{record['note']}")
    print(f"写入：{LOG_FILE}")


if __name__ == "__main__":
    main()
