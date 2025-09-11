import csv
from collections import defaultdict

# Read input file
data_file = "gita.csv"
with open(data_file, "r", encoding="utf-8") as f:
    lines = [line.strip() for line in f if line.strip()]

# Step 1: Group lines by chapter.verse
verse_lines = defaultdict(list)

for line in lines:
    ref, text = line.split(",", 1)
    chap, verse, lnum = map(int, ref.split("."))
    verse_lines[(chap, verse)].append((lnum, text, ref))

# Step 2: Adjust line numbers if verse starts with 0
adjusted_lines = []
for (chap, verse), items in verse_lines.items():
    offset = 0
    if any(lnum == 0 for lnum, _, _ in items):
        offset = 1
    for lnum, text, ref in items:
        new_lnum = lnum + offset
        url = f"https://chinmayagita.net/wp-content/uploads/bvg/{chap:02}/bvg{chap:02}v{verse:02}l{new_lnum:03}.mp3"
        adjusted_lines.append(f"{ref},{text},{url}")

# Step 3: Preserve original order
adjusted_lines.sort(key=lambda x: list(map(int, x.split(",")[0].split("."))))

# Write output file
with open("gita_with_urls.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    for line in adjusted_lines:
        writer.writerow(line.split(","))

print("Processed file written to gita_with_urls.csv")
