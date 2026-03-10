import sys
import re

with open('src/pages/chat/ChatRoom.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The file has a corrupted return statement. Let's fix it safely.

# 1. Remove the bad wrapping
bad_wrap1 = """    </div>\n  ) : searchMode ? ("""
good_wrap1 = """      {searchMode ? ("""
if bad_wrap1 in content:
    content = content.replace(bad_wrap1, good_wrap1)

bad_wrap2 = """    </div>\n  ) : ("""
good_wrap2 = """      ) : ("""
if bad_wrap2 in content:
    content = content.replace(bad_wrap2, good_wrap2)

bad_wrap3 = """  )\n}\n\n{/* Hidden audio element"""
good_wrap3 = """      )}\n\n      {/* Hidden audio element"""
if bad_wrap3 in content:
    content = content.replace(bad_wrap3, good_wrap3)

# 2. Extract and remove the corrupted section
# It starts at "{/* Messages Area */ }" 
# followed by:
#                   : "bg-slate-50...
# and ends before "{/* Body */}"
pattern = r"\{/\* Messages Area \*/ \}\n\s+: \"bg-slate-50.*?(?=\{/\* Body \*/\})"

new_content = re.sub(pattern, '', content, flags=re.DOTALL)

with open('src/pages/chat/ChatRoom.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(content == new_content)
print("Done!")
