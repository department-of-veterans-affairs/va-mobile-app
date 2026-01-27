#!/usr/bin/env python3
"""
LM Studio custom plug‑in: fetch_url.py

Usage:
    LM Studio passes the whole prompt to this script via stdin.
    The script looks for a URL in the text (simple regex),
    downloads it, extracts the main body text,
    and prints that text to stdout.

The printed output is automatically inserted into LM Studio
as the plug‑in’s response.
"""

import sys
import re
import requests
from bs4 import BeautifulSoup

# ------------------------------------------------------------------
# 1️⃣  Find a URL in the incoming prompt
# ------------------------------------------------------------------
prompt = sys.stdin.read()

url_match = re.search(r"https?://[^\s]+", prompt)
if not url_match:
    print("⚠️ No URL found in the prompt.", file=sys.stderr)
    sys.exit(1)

url = url_match.group(0)
print(f"🔎 Fetching {url} …", file=sys.stderr)

# ------------------------------------------------------------------
# 2️⃣  Download the page
# ------------------------------------------------------------------
try:
    resp = requests.get(url, timeout=15)
    resp.raise_for_status()
except Exception as e:
    print(f"❌ Failed to fetch {url}: {e}", file=sys.stderr)
    sys.exit(1)

# ------------------------------------------------------------------
# 3️⃣  Parse the page – grab visible text only
# ------------------------------------------------------------------
soup = BeautifulSoup(resp.text, "html.parser")

# Remove scripts & styles
for tag in soup(["script", "style", "noscript"]):
    tag.decompose()

# Grab all paragraph/text nodes
text_chunks = []
for p in soup.find_all(["p", "h1", "h2", "h3", "li"]):
    txt = p.get_text(strip=True)
    if txt:
        text_chunks.append(txt)

if not text_chunks:
    print("⚠️ No readable text extracted.", file=sys.stderr)
    sys.exit(1)

# Join into a single string (you can tweak this if you want summaries, etc.)
output_text = "\n\n".join(text_chunks)

# ------------------------------------------------------------------
# 4️⃣  Output to LM Studio
# ------------------------------------------------------------------
print("\n---BEGIN FETCHED CONTENT---\n")
print(output_text)
print("\n---END FETCHED CONTENT---")

# The script exits normally – LM Studio will treat everything printed
# to stdout as the plug‑in response.