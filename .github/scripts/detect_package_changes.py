#!/usr/bin/env python3
"""
Detects package.json dependency changes between two git commits.

This script compares package.json files between a base and head commit,
identifying added, removed, or changed dependencies. It also attempts
to find the exact line number in the file where each dependency is defined.

Output format (tab-separated):
    TYPE    KEY                     NAME    OLD_VERSION    NEW_VERSION    FILE    LINE_NUMBER    LINE_TEXT

Types: added, removed, changed
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Optional


def run_git_command(cmd: List[str]) -> str:
    """Run a git command and return output."""
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running git command: {e}", file=sys.stderr)
        return ""


def get_file_content(sha: str, filepath: str) -> Dict:
    """Get JSON content of a file at a specific commit."""
    cmd = ["git", "show", f"{sha}:{filepath}"]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return json.loads(result.stdout)
    except (subprocess.CalledProcessError, json.JSONDecodeError):
        return {}


def find_line_number(sha: str, filepath: str, search_key: str) -> Tuple[Optional[int], Optional[str]]:
    """Find the line number and text for a given key in a JSON file."""
    cmd = ["git", "show", f"{sha}:{filepath}"]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        lines = result.stdout.split('\n')
        for i, line in enumerate(lines, 1):
            if f'"{search_key}"' in line:
                return i, line.strip()
    except subprocess.CalledProcessError:
        pass
    return None, None


def detect_changes(base_sha: str, head_sha: str, filepath: str) -> List[Dict]:
    """
    Detect dependency changes in a package.json file.
    
    Returns a list of changes, each containing:
    - type: 'added', 'removed', or 'changed'
    - key: the full path to the change (e.g., 'dependencies.react')
    - name: the dependency name (or empty for scalar keys like 'version')
    - old: the old value
    - new: the new value
    - file: the filepath
    - line: line number where the change occurs
    - text: the line text at that location
    """
    base_content = get_file_content(base_sha, filepath)
    head_content = get_file_content(head_sha, filepath)
    
    # Keys we care about
    interesting_keys = [
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'optionalDependencies',
        'name',
        'version'
    ]
    
    changes = []
    
    for key in interesting_keys:
        base_val = base_content.get(key, {})
        head_val = head_content.get(key, {})
        
        # Handle scalar values (name, version)
        if isinstance(base_val, str) or isinstance(head_val, str):
            if base_val != head_val:
                # For scalar changes, find the line in head (or base if removed)
                src_sha = head_sha if head_val else base_sha
                line_num, line_text = find_line_number(src_sha, filepath, key)
                
                changes.append({
                    'type': 'changed',
                    'key': key,
                    'name': '',
                    'old': str(base_val) if base_val else '',
                    'new': str(head_val) if head_val else '',
                    'file': filepath,
                    'line': line_num,
                    'text': line_text or ''
                })
            continue
        
        # Handle dictionary values (dependencies)
        if not isinstance(base_val, dict):
            base_val = {}
        if not isinstance(head_val, dict):
            head_val = {}
        
        # Added dependencies
        for dep in sorted(set(head_val.keys()) - set(base_val.keys())):
            line_num, line_text = find_line_number(head_sha, filepath, dep)
            changes.append({
                'type': 'added',
                'key': f"{key}.{dep}",
                'name': dep,
                'old': '',
                'new': str(head_val[dep]),
                'file': filepath,
                'line': line_num,
                'text': line_text or ''
            })
        
        # Removed dependencies
        for dep in sorted(set(base_val.keys()) - set(head_val.keys())):
            line_num, line_text = find_line_number(base_sha, filepath, dep)
            changes.append({
                'type': 'removed',
                'key': f"{key}.{dep}",
                'name': dep,
                'old': str(base_val[dep]),
                'new': '',
                'file': filepath,
                'line': line_num,
                'text': line_text or ''
            })
        
        # Changed dependencies
        for dep in sorted(set(base_val.keys()) & set(head_val.keys())):
            if base_val[dep] != head_val[dep]:
                line_num, line_text = find_line_number(head_sha, filepath, dep)
                changes.append({
                    'type': 'changed',
                    'key': f"{key}.{dep}",
                    'name': dep,
                    'old': str(base_val[dep]),
                    'new': str(head_val[dep]),
                    'file': filepath,
                    'line': line_num,
                    'text': line_text or ''
                })
    
    return changes


def format_alert_line(change: Dict) -> str:
    """Format a change into a human-readable alert line."""
    file = change['file']
    line = change['line']
    text = change['text']
    type_ = change['type']
    key = change['key']
    old = change['old']
    new = change['new']
    
    if line:
        return f"{file}:{line}: {text} -> {type_} {key} {old} -> {new}"
    else:
        return f"{file}: {type_} {key} {old} -> {new} (line not found)"


def main():
    if len(sys.argv) != 3:
        print("Usage: detect_package_changes.py <base_sha> <head_sha>", file=sys.stderr)
        sys.exit(1)
    
    base_sha = sys.argv[1]
    head_sha = sys.argv[2]
    
    # Find changed package.json files
    cmd = ["git", "diff", "--name-only", base_sha, head_sha]
    changed_files = run_git_command(cmd).split('\n')
    package_files = [f for f in changed_files if f.endswith('package.json')]
    
    all_changes = []
    all_alert_lines = []
    has_dependency_changes = False
    
    for filepath in package_files:
        if not filepath:  # Skip empty strings
            continue
            
        changes = detect_changes(base_sha, head_sha, filepath)
        
        if changes:
            has_dependency_changes = True
            all_changes.extend(changes)
            for change in changes:
                all_alert_lines.append(format_alert_line(change))
        else:
            # No package-related changes; capture diff for context
            cmd = ["git", "diff", "--unified=0", base_sha, head_sha, "--", filepath]
            diff_output = run_git_command(cmd)
            diff_lines = [line for line in diff_output.split('\n') if line.startswith(('+', '-'))]
            all_alert_lines.append(f"Non-package changes in {filepath}:")
            all_alert_lines.extend(diff_lines)
    
    # Output results
    if has_dependency_changes:
        print("any_changed=true")
        print("✅ package.json package-related changes detected")
    else:
        print("any_changed=false")
        if package_files and any(package_files):
            print("❌ No package dependency changes detected (only scripts/other fields changed)")
        else:
            print("❌ No package.json changes detected")
    
    # Output alert lines (one per line for easy parsing)
    if all_alert_lines:
        print("\n=== ALERT_LINES ===")
        for line in all_alert_lines:
            print(line)
        print("=== END_ALERT_LINES ===")


if __name__ == "__main__":
    main()
