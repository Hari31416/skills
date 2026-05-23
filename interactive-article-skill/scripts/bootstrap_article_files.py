#!/usr/bin/env python3
"""Copy interactive article starter files from the skill assets into a target directory.

Usage
-----
    # Minimal — base only (default)
    python bootstrap_article_files.py <target-dir> --article-file <topic>.html

    # With specific components
    python bootstrap_article_files.py <target-dir> --article-file <topic>.html \\
        --components quiz stepper

    # All components
    python bootstrap_article_files.py <target-dir> --article-file <topic>.html \\
        --components all

Available components: flashcard, quiz, stepper, comparison-slider, comparison-tabs, primitives
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

AVAILABLE_COMPONENTS = [
    "flashcard",
    "quiz",
    "stepper",
    "comparison-slider",
    "comparison-tabs",
    "primitives",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Copy base.css, base.js, and template.html from this skill's assets folder "
            "into a target directory, optionally including interactive component files."
        )
    )
    parser.add_argument(
        "target_dir",
        nargs="?",
        default=".",
        help="Directory where starter files should be copied (default: current directory).",
    )
    parser.add_argument(
        "--article-file",
        help=(
            "If provided, template.html is copied using this output file name "
            "(example: kafka-guide.html)."
        ),
    )
    parser.add_argument(
        "--components",
        nargs="+",
        metavar="COMPONENT",
        default=[],
        help=(
            f"Interactive components to include. Use 'all' for everything. "
            f"Available: {', '.join(AVAILABLE_COMPONENTS)}. Default: none."
        ),
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite destination files if they already exist.",
    )
    return parser.parse_args()


def resolve_components(requested: list[str]) -> list[str]:
    if not requested:
        return []
    if "all" in requested:
        return list(AVAILABLE_COMPONENTS)
    unknown = set(requested) - set(AVAILABLE_COMPONENTS)
    if unknown:
        raise ValueError(
            f"Unknown component(s): {', '.join(sorted(unknown))}. "
            f"Available: {', '.join(AVAILABLE_COMPONENTS)}"
        )
    # Preserve the canonical order
    return [c for c in AVAILABLE_COMPONENTS if c in requested]


def copy_file(src: Path, dst: Path, overwrite: bool) -> None:
    if dst.exists() and not overwrite:
        raise FileExistsError(
            f"Destination file already exists: {dst}\n"
            "Use --overwrite to replace existing files."
        )
    shutil.copy2(src, dst)
    print(f"Copied  {src.name} -> {dst}")


def inject_component_tags(html: str, components: list[str]) -> str:
    """Replace placeholder comments in the template with <link> and <script> tags."""
    css_tags = "\n".join(
        f'    <link rel="stylesheet" href="./components/{c}.css" />' for c in components
    )
    js_tags = "\n".join(
        f'    <script src="./components/{c}.js"></script>' for c in components
    )
    html = html.replace("    <!-- COMPONENT_CSS -->", css_tags, 1)
    html = html.replace("    <!-- COMPONENT_JS -->", js_tags, 1)
    return html


def main() -> int:
    args = parse_args()

    script_dir = Path(__file__).resolve().parent
    skill_dir = script_dir.parent
    assets_dir = skill_dir / "assets"
    components_src_dir = assets_dir / "components"

    components = resolve_components(args.components)

    target_dir = Path(args.target_dir).expanduser().resolve()
    target_dir.mkdir(parents=True, exist_ok=True)

    # --- Base files ---
    copy_file(assets_dir / "base.css", target_dir / "base.css", args.overwrite)
    copy_file(assets_dir / "base.js", target_dir / "base.js", args.overwrite)

    # --- Template ---
    template_src = assets_dir / "template.html"
    article_filename = args.article_file or "template.html"
    article_dst = target_dir / article_filename

    template_html = template_src.read_text(encoding="utf-8")
    article_html = inject_component_tags(template_html, components)

    if article_dst.exists() and not args.overwrite:
        raise FileExistsError(
            f"Destination file already exists: {article_dst}\n"
            "Use --overwrite to replace existing files."
        )
    article_dst.write_text(article_html, encoding="utf-8")
    print(f"Wrote   {article_filename} -> {article_dst}")

    # --- Component files ---
    if components:
        comp_dst_dir = target_dir / "components"
        comp_dst_dir.mkdir(exist_ok=True)
        for comp in components:
            for ext in (".css", ".js"):
                src = components_src_dir / f"{comp}{ext}"
                dst = comp_dst_dir / f"{comp}{ext}"
                copy_file(src, dst, args.overwrite)
    else:
        print("No components requested — base only.")

    print(f"\nDone. Article bootstrapped in: {target_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
