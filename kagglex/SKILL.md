---
name: kagglex
description: Install and use the kagglex module to run Python scripts, modules, or experiments on remote Kaggle GPUs and TPUs, stream remote execution logs, pull output artifacts, manage Kaggle datasets, or run interactive REPL commands on active Kaggle notebooks. Use whenever the user asks to run code on Kaggle, train models on cloud GPUs or TPUs, offload heavy compute, dispatch remote training jobs, run torchrun on Kaggle, or interact with Kaggle notebook sessions.
---

# kagglex

Execute local Python code, modules, and experiments on Kaggle GPUs and TPUs.

## Overview

Use this skill when you need cloud compute (Nvidia T4 x2, P100, or TPU v3-8) to train models, evaluate checkpoints, run batch inference, or test code interactively on Kaggle hardware.

The module packages your local workspace, injects dependencies and secrets, uploads the payload to Kaggle, triggers execution, streams remote logs, and downloads resulting artifacts.

## Installation and setup

Install the CLI using `uv`. Pick the installation method that matches your environment:

Install globally as a CLI tool:

```bash
uv tool install kagglex
```

Install into the active Python virtual environment:

```bash
uv pip install kagglex
```

When working inside the `kagglex` repository itself, install in editable mode:

```bash
uv pip install -e .
```

Run ephemerally without permanent installation:

```bash
uv run --with kagglex kagglex --help
```

## Pre-flight verification

Before dispatching jobs, verify credentials and network access:

```bash
python -c "from kagglex.client import check_kaggle_health; ok, user = check_kaggle_health(); print(f'Authenticated as {user}' if ok else f'Auth failed: {user}')"
```

Authentication requires either:

- A valid credential file at `~/.kaggle/kaggle.json` with your username and API key.
- The environment variables `KAGGLE_USERNAME` and `KAGGLE_KEY`.

Ensure your Kaggle account has accepted phone verification if you plan to use GPU or TPU accelerators.

## Batch job execution

Run local code remotely using `kagglex run`.

### Standalone script execution

Run a single script on a dual T4 GPU accelerator:

```bash
kagglex run --file train.py --gpu t4-2x --title "Baseline Training"
```

### Module and package execution

For projects with package layouts or multiple files, pass the command string directly:

```bash
kagglex run --dir . --command "python -m mypkg.train --epochs 10 --batch-size 32" --gpu t4-2x
```

### Multi-GPU acceleration

When running multi-GPU jobs on `t4-2x`, use the `--multi-gpu` flag or pass `torchrun`:

```bash
kagglex run --dir . --command "torchrun --nproc_per_node=2 -m mypkg.train" --gpu t4-2x --multi-gpu
```

### Remote dependencies and secrets

Inject external pip packages, environment variables, or Kaggle secrets into the remote environment:

```bash
kagglex run --file train.py \
  --extra-deps "transformers>=4.40.0" "accelerate" "wandb" \
  --secret WANDB_API_KEY \
  --secret HF_TOKEN \
  --env WANDB_PROJECT=image-classifier
```

### Mounting datasets and local data

Attach existing Kaggle datasets or bundle local data folders:

```bash
kagglex run --file train.py \
  --dataset "zillow/zecon" \
  --include-data ./data/splits
```

Attached datasets mount under `/kaggle/input/<dataset-name>/`.

### Large payload offloading (--auto-dataset)

When your repository or bundled assets exceed Kaggle's 5 MB inline code limit, pass `--auto-dataset` to automatically publish and version a private Kaggle dataset containing the payload:

```bash
kagglex run --dir . --command "python train.py" --include-data ./embeddings --auto-dataset
```

## Monitoring and artifact sync

### Real-time streaming

Stream logs directly to stdout as the kernel runs:

```bash
kagglex run --file train.py --stream
```

### Non-blocking execution

Submit a job without waiting:

```bash
kagglex run --file train.py --no-wait --slug my-run-01
```

### List recent runs

List recent runs recorded across your machine in `~/.kagglex/runs.json`:

```bash
kagglex list --limit 10
```

### Cancel an ongoing run

Cancel an active or queued remote kernel:

```bash
kagglex cancel my-run-01
```

### Artifact download filtering

By default, completed runs download outputs to `./outputs`. Filter downloaded artifacts using glob patterns:

```bash
kagglex run --file train.py \
  --output-dir ./results \
  --include-outputs "metrics.json" \
  --include-outputs "best_model.pt" \
  --exclude-outputs "checkpoint_epoch_*.pt"
```

## GPU/TPU Quota Tracking

Track rolling accelerator consumption against Kaggle's weekly limits (30 GPU hours / 20 TPU hours):

```bash
# View quota dashboard (past 7 days by default)
kagglex quota

# Check custom window and thresholds
kagglex quota --days 14 --gpu-limit 40.0 --tpu-limit 30.0
```

Run history is tracked globally in `~/.kagglex/runs.json` across all local repositories.

## Declarative Configuration

Set machine-wide defaults in `~/.kagglex/config.toml`:

```toml
# ~/.kagglex/config.toml
gpu = "p100"
quota_days = 7
gpu_weekly_limit_hours = 30.0
kaggle_secrets = ["WANDB_API_KEY", "HF_TOKEN"]

[env]
WANDB_ENTITY = "my-org"
```

Override project settings in `pyproject.toml` or `kagglex.toml`:

```toml
# pyproject.toml
[tool.kagglex]
gpu = "t4-2x"
multi_gpu = true
auto_dataset = false
include_outputs = ["*.json", "checkpoints/*"]

[tool.kagglex.env]
WANDB_PROJECT = "vit-finetune"
```

CLI flags override all configuration files.

## Interactive REPL execution

When a Kaggle notebook session is active, connect directly to its Jupyter proxy server for low-latency command execution and debugging.

Set the proxy URL via environment variable:

```bash
export KAGGLE_JUPYTER_URL="https://kkb-production.jupyter-proxy.kaggle.net/k/12345678/abcdef?token=YOUR_TOKEN"
```

Or pass `--url` with each command.

Test connection:

```bash
kagglex exec --test
```

Inspect available GPUs and memory:

```bash
kagglex exec --gpu-info
```

Execute a Python code string:

```bash
kagglex exec "import torch; print(torch.cuda.get_device_name(0))"
```

Execute a local script on the remote kernel:

```bash
kagglex exec --file debug_step.py
```

List remote files in `/kaggle/working/`:

```bash
kagglex exec --list-files
```

Transfer files between local and remote environments:

```bash
kagglex exec --upload ./local_weights.pt
kagglex exec --download output_metrics.json -o ./metrics.json
```

## Kaggle dataset management

Push local directories to Kaggle as versioned datasets:

```bash
kagglex dataset push --dir ./data/embeddings --title "Text Embeddings Dataset"
```

## Python SDK usage

Integrate `kagglex` programmatically in Python workflows:

```python
from pathlib import Path
from kagglex import KaggleRunner, RunConfig

runner = KaggleRunner(repo_root=Path("."))
config = RunConfig(
    command="python -m mypkg.train --epochs 5",
    title="Fine Tuning",
    gpu_type="t4-2x",
    multi_gpu=True,
    auto_dataset=False,
    extra_pip_deps=["wandb"],
    kaggle_secrets=["WANDB_API_KEY"],
)

job = runner.run(config=config, wait=True, stream=True, pull=True)
print(f"Final status: {job.status}")
```

## References

For full parameter listings, configuration options, and debugging workflows, consult the reference documents:

- [CLI Reference](references/cli-reference.md)
- [SDK Reference](references/sdk-reference.md)
- [Interactive REPL Reference](references/interactive-repl.md)
- [Troubleshooting Guide](references/troubleshooting.md)
