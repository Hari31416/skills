.PHONY: setup serve build clean pdf consolidate

# Using uv to run mkdocs with required plugins dynamically in an isolated Python 3.12 environment.
UV_RUN := uv run --python 3.12 --with mkdocs --with mkdocs-material --with pymdown-extensions --with mkdocs-print-site-plugin

setup:
	@echo "Checking for uv..."
	@command -v uv >/dev/null 2>&1 || (echo "Error: uv is not installed. Please install uv first (e.g. via 'curl -LsSf https://astral.sh/uv/install.sh | sh')." && exit 1)
	@echo "uv is available."

serve: setup
	$(UV_RUN) mkdocs serve -f ./mkdocs-dossier.yml

build: setup
	$(UV_RUN) mkdocs build -f ./mkdocs-dossier.yml

clean:
	rm -rf ./site-dossier consolidated_dossier.md consolidated_dossier.pdf mermaid-filter.err

consolidated_dossier.md: src/index.md \
                         src/00-evidence-map.md \
                         src/01-product-and-system-overview.md \
                         src/02-agentic-ai-architecture.md \
                         src/03-backend-deep-dive.md \
                         src/04-frontend-deep-dive.md \
                         src/05-data-model-and-storage.md \
                         src/06-infra-and-local-ops.md \
                         src/07-security-and-safety.md \
                         src/08-testing-and-quality.md \
                         src/09-unique-engineering-highlights.md \
                         src/10-interview-prep.md \
                         src/11-open-questions-and-risks.md
	@echo "Consolidating src markdown files into consolidated_dossier.md..."
	cat src/index.md > consolidated_dossier.md
	@for f in 00-evidence-map.md \
	          01-product-and-system-overview.md \
	          02-agentic-ai-architecture.md \
	          03-backend-deep-dive.md \
	          04-frontend-deep-dive.md \
	          05-data-model-and-storage.md \
	          06-infra-and-local-ops.md \
	          07-security-and-safety.md \
	          08-testing-and-quality.md \
	          09-unique-engineering-highlights.md \
	          10-interview-prep.md \
	          11-open-questions-and-risks.md; do \
		echo "" >> consolidated_dossier.md; \
		echo "---" >> consolidated_dossier.md; \
		echo "" >> consolidated_dossier.md; \
		cat src/$$f >> consolidated_dossier.md; \
	done
	@echo "Consolidation complete."

consolidate: consolidated_dossier.md

pdf: consolidated_dossier.md
	PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
	MERMAID_FILTER_SCALE=3 \
	pandoc consolidated_dossier.md -o consolidated_dossier.pdf \
		--pdf-engine=xelatex \
		-V mainfont="Arial" \
		-V monofont="Menlo" \
		-V geometry:margin=1in \
		--filter mermaid-filter \
		-V header-includes="\usepackage[htt]{hyphenat}\setlength{\tabcolsep}{4pt}\let\oldlongtable\longtable\let\endoldlongtable\endlongtable\renewenvironment{longtable}[2][]{\small\oldlongtable[#1]{#2}}{\endoldlongtable}"
	@rm -f mermaid-filter.err
