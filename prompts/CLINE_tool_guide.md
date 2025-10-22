# Cline Tool Usage Guide (Adapted for This Model)

## Overview
This model can interact with the project’s file system and perform limited actions using the following tools:

| Tool | Purpose | When to Use |
|------|--------|------------|
| **write_to_file** | Create a new file or overwrite an existing one. | Use for new files, large rewrites, or when you have the complete final content. |
| **replace_in_file** | Make targeted edits to an existing file. | Use for small, precise changes (e.g., modify a line, add a block). |
| **read_file** (via MCP) | Read the full contents of a file. | Use when you need to inspect a file’s content before editing. |
| **list_files** | List files in a directory (optional recursive). | Use to explore the project structure. |
| **search_files** | Regex‑based search across files. | Use to locate patterns, TODOs, or specific code snippets. |
| **execute_command** | Run a shell command. | Use for building, testing, or any CLI operation. |
| **ask_followup_question** | Ask the user for missing information. | Use only when required data is not available. |
| **attempt_completion** | Finalize the task and present the result. | Use after all work is done. |

### How to Use Each Tool

### 1. `write_to_file`
```xml
<write_to_file>
<path>relative/path/to/file.md</path>
<content>
Your full file content here.
