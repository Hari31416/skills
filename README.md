# Skills

Some LLM skills for (mostly) personal use. You are free to use them as you wish to treat these as starting point to create your own skills.

## Install

```bash
# List skills in this repository
npx skills add hari31416/skills --list

# Install specific skills
npx skills add hari31416/skills --skill interactive-article-skill

# Install a skill with spaces in the name (must be quoted)
npx skills add hari31416/skills --skill "Skill With Spaces"

# Install to specific agents
npx skills add hari31416/skills -a claude-code -a opencode

# Non-interactive installation (CI/CD friendly)
npx skills add hari31416/skills --skill interactive-article-skill -g -a claude-code -y

# Install all skills from this repo to all agents
npx skills add hari31416/skills --all

# Install all skills to specific agents
npx skills add hari31416/skills --skill '*' -a claude-code

# Install specific skills to all agents
npx skills add hari31416/skills --agent '*' --skill interactive-article-skill
```

## Available Skills

- **Interactive Article Skill:** Inspired by [The unreasonable effectiveness of HTML](https://thariqs.github.io/html-effectiveness/) and my desire to quickly create interactive articles, this skill allows you to generate HTML content with embedded JavaScript and CSS. It can be used to create interactive tutorials, demonstrations, or any content that benefits from interactivity. Some of the articles that I have generated using this skills are deployed here: [Interactive Articles](https://notes.hari31416.in/).
