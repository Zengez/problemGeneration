#!/usr/bin/env python3

import argparse
import json
from pathlib import Path


def parse_file(path: Path, base_dir: Path):
    """
    Parse a tagged text file.

    Accepted forms:

        TITLE: Optional Title
        TAGS: Tag1, Tag2, Tag3

        Body...

    or:

        TAGS: Tag1, Tag2, Tag3

        Body...

    TITLE must come before TAGS when present.
    """

    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    title = path.stem
    tags = []

    if not lines:
        raise ValueError("file is empty")

    i = 0

    if lines[i].startswith("TITLE:"):
        explicit_title = lines[i][len("TITLE:"):].strip()

        if explicit_title:
            title = explicit_title

        i += 1

    if i >= len(lines) or not lines[i].startswith("TAGS:"):
        raise ValueError(
            "expected TAGS: line"
            + (" after TITLE:" if i > 0 else " as first line")
        )

    raw_tags = lines[i][len("TAGS:"):].strip()

    if raw_tags:
        tags = [
            tag.strip()
            for tag in raw_tags.split(",")
            if tag.strip()
        ]

    # Remove duplicate tags while preserving order.
    seen = set()
    unique_tags = []

    for tag in tags:
        key = tag.casefold()

        if key not in seen:
            seen.add(key)
            unique_tags.append(tag)

    relative_path = path.relative_to(base_dir).as_posix()

    return {
        "title": title,
        "file": relative_path,
        "tags": unique_tags,
        "url": "files/" + relative_path,
    }


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "source",
        nargs="?",
        default="entries",
        help="directory containing .txt files",
    )

    parser.add_argument(
        "output",
        nargs="?",
        default="index.json",
        help="JSON index to create",
    )

    args = parser.parse_args()

    source = Path(args.source)
    output = Path(args.output)

    if not source.exists():
        raise SystemExit(f"Source directory does not exist: {source}")

    records = []
    errors = []

    for path in sorted(source.rglob("*.txt")):
        try:
            records.append(parse_file(path, source))
        except Exception as exc:
            errors.append(f"{path}: {exc}")

    if errors:
        print()
        print("ERROR: One or more text files have invalid metadata:")
        print()

        for error in errors:
            print(f"  {error}")

        print()
        raise SystemExit(1)

    # Sort records by displayed title.
    records.sort(key=lambda item: item["title"].casefold())

    # Build one canonical global tag list.
    tag_names = {}

    for record in records:
        for tag in record["tags"]:
            key = tag.casefold()

            if key not in tag_names:
                tag_names[key] = tag

    tags = sorted(
        tag_names.values(),
        key=str.casefold,
    )

    data = {
        "files": records,
        "tags": tags,
        "fileCount": len(records),
        "tagCount": len(tags),
    }

    output.parent.mkdir(parents=True, exist_ok=True)

    output.write_text(
        json.dumps(
            data,
            indent=2,
            ensure_ascii=False,
        ) + "\n",
        encoding="utf-8",
    )

    print(
        f"Generated {output}: "
        f"{len(records)} file(s), "
        f"{len(tags)} unique tag(s)"
    )


if __name__ == "__main__":
    main()
