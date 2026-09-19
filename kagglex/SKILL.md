---
name: kagglex
description: Load when needed to execute Python scripts, modules, or experiments on remote Kaggle GPUs and TPUs, track accelerator quotas, manage datasets, and run interactive REPL commands in Kaggle notebooks.
---

# kagglex

Execute local Python code, modules, and experiments on Kaggle GPUs and TPUs.

## Setup and authentication

Install the CLI:

```bash
uv pip install kagglex
```

Authentication requires either `~/.kaggle/kaggle.json` or the environment variables `KAGGLE_USERNAME` and `KAGGLE_KEY`. Verify authentication status:

```bash
python -c "from kagglex.client import check_kaggle_health; ok, u = check_kaggle_health(); print(u if ok else 'failed')"
```

GPU and TPU accelerators require a phone-verified Kaggle account.

## Batch execution

Run local code remotely on Kaggle accelerators (`t4-2x`, `p100`, `v3-8`, or `none`).

### Standalone script

Run a single script on a dual T4 GPU accelerator:

```bash
kagglex run --file train.py --gpu t4-2x --title "Baseline Training"
```

### Module or package command

Execute a module inside a repository layout with multi-GPU wrapping and log streaming:

```bash
kagglex run --dir . \
  --command "torchrun --nproc_per_node=2 -m mypkg.train --epochs 10" \
  --gpu t4-2x \
  --multi-gpu \
  --stream
```

### Dependencies, secrets, and datasets

Inject dependencies, environment variables, Kaggle secrets, and dataset mounts:

```bash
kagglex run --file train.py \
  --extra-deps "transformers>=4.40.0" "accelerate" "wandb" \
  --secret WANDB_API_KEY \
  --env WANDB_PROJECT=image-classifier \
  --dataset "username/dataset-name" \
  --include-data ./data/splits
```

Attached datasets mount under `/kaggle/input/<dataset-name>/`.

### Large payload offloading

When local code or bundled data exceeds 5 MB, add `--auto-dataset` to automatically publish and version a private Kaggle dataset containing the payload:

```bash
kagglex run --dir . --command "python train.py" --include-data ./embeddings --auto-dataset
```

### Non-blocking submission and output filtering

Submit without waiting and filter downloaded artifacts upon completion:

```bash
# Non-blocking run
kagglex run --file train.py --no-wait --slug my-run-01

# Download specific artifact patterns to a custom folder
kagglex run --file train.py \
  --output-dir ./results \
  --include-outputs "metrics.json" "best_model.pt" \
  --exclude-outputs "checkpoint_epoch_*.pt"
```

## Quota and run management

Track accelerator consumption against weekly limits (30 GPU hours / 20 TPU hours):

```bash
# View 7-day rolling accelerator consumption
kagglex quota

# Query custom rolling window and limits
kagglex quota --days 14 --gpu-limit 40.0 --tpu-limit 30.0

# List recent runs across all local repositories
kagglex list --limit 10

# Cancel an active or queued kernel
kagglex cancel <slug-or-id>
```

## Interactive REPL execution

Connect directly to an active Kaggle notebook session for low-latency debugging:

```bash
# Set Jupyter proxy URL from Kaggle notebook (Run -> Kaggle Jupyter Server -> Copy URL)
export KAGGLE_JUPYTER_URL="https://kkb-production.jupyter-proxy.kaggle.net/k/123/token=YOUR_TOKEN"

# Test connection and query GPU hardware
kagglex exec --test
kagglex exec --gpu-info

# Execute inline Python or local scripts remotely
kagglex exec "import torch; print(torch.cuda.get_device_name(0))"
kagglex exec --file debug_step.py

# Transfer files to and from /kaggle/working/
kagglex exec --upload ./weights.pt
kagglex exec --download output_metrics.json -o ./metrics.json
```

## Dataset management

Upload or update a Kaggle dataset from a local folder:

```bash
kagglex dataset push --dir ./data/embeddings --title "Text Embeddings Dataset"
```

## Declarative configuration

Set project-level defaults in `pyproject.toml` or `kagglex.toml`:

```toml
[tool.kagglex]
gpu = "t4-2x"
multi_gpu = true
auto_dataset = false
include_outputs = ["*.json", "checkpoints/*"]

[tool.kagglex.env]
WANDB_PROJECT = "vit-finetune"
```

Set machine-wide defaults in `~/.kagglex/config.toml`. CLI flags override configuration files.

## Python SDK

Programmatic interface for automation workflows:

```python
from pathlib import Path
from kagglex import KaggleRunner, RunConfig

runner = KaggleRunner(repo_root=Path("."))
config = RunConfig(
    command="python -m mypkg.train --epochs 5",
    title="Fine Tuning",
    gpu_type="t4-2x",
    multi_gpu=True,
    extra_pip_deps=["wandb"],
    kaggle_secrets=["WANDB_API_KEY"],
)

job = runner.run(config=config, wait=True, stream=True, pull=True)
print(f"Status: {job.status}")
```

## References

Consult dedicated reference guides when you need exhaustive parameter listings or troubleshooting:

- [CLI Reference](references/cli-reference.md): Full parameter specifications and configuration file options.
- [Interactive REPL Reference](references/interactive-repl.md): Connection details, execution timeouts, and session management.
- [SDK Reference](references/sdk-reference.md): Detailed API reference for `KaggleRunner`, `RunConfig`, and `Job`.
- [Troubleshooting Guide](references/troubleshooting.md): Solutions for auth issues, quota errors, packaging limits, and network disconnects.
