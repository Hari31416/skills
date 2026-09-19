# SDK Reference

Programmatic Python interface for `kagglex`.

## Importing the module

```python
from kagglex import (
    DatasetConfig,
    InteractiveClient,
    Job,
    KaggleRunner,
    RunConfig,
    RunRecord,
)
```

## KaggleRunner

The primary class for dispatching and managing remote Kaggle jobs.

```python
from pathlib import Path
from kagglex import KaggleRunner, RunConfig

runner = KaggleRunner(repo_root=Path("."))
```

### Methods

#### run

Stage, submit, and optionally wait for a job:

```python
config = RunConfig(
    command="python -m mypkg.train --epochs 5",
    title="Fine Tuning",
    gpu_type="t4-2x",
    multi_gpu=True,
    dataset_slugs=["username/my-dataset"],
    extra_pip_deps=["wandb"],
    kaggle_secrets=["WANDB_API_KEY"],
    env_vars={"WANDB_PROJECT": "experiment-1"},
    output_dir=Path("./results"),
    auto_dataset=False,
)

job = runner.run(config=config, wait=True, stream=True, pull=True)
print(f"Finished with status: {job.status}")
```

#### stage

Package project files locally without uploading to Kaggle. Useful for dry runs and inspection:

```python
staging_path = runner.stage(config=config)
print(f"Staged at: {staging_path}")
```

#### list_runs

Query recent run records from `~/.kagglex/runs.json`:

```python
records = runner.list_runs(limit=10)
```

#### cancel

Cancel an active remote kernel:

```python
cancelled = runner.cancel("username/kernel-slug")
```

## Job

Handle returned by `runner.run()`.

### Properties

- `job.kernel_id`: Kaggle kernel identifier in `username/kernel-slug` format.
- `job.url`: Web URL to the kernel on Kaggle.
- `job.status`: Current execution state string (`queued`, `running`, `complete`, `error`).
- `job.last_status_info`: Dictionary containing full response from Kaggle status check.

### Methods

#### wait

Block until execution completes, fails, or is cancelled:

```python
info = job.wait(poll_interval=20, timeout_sec=3600)
print(f"Finished with status: {info['status']}")
```

#### stream_logs

Stream live console output to stdout:

```python
job.stream_logs()
```

#### pull_outputs

Download generated artifacts from the remote kernel:

```python
downloaded_files = job.pull_outputs(
    dest_dir=Path("./results"),
    include_patterns=["*.json", "*.pt"],
    exclude_patterns=["cache/*"],
)
```

#### cancel

Request immediate job termination:

```python
success = job.cancel()
```

## RunConfig

Dataclass specifying run options:

```python
from dataclasses import dataclass, field
from pathlib import Path

@dataclass
class RunConfig:
    command: str
    title: str
    slug: str | None = None
    project_dir: Path | None = None
    target_file: Path | None = None
    gpu_type: str = "t4-2x"
    enable_tpu: bool = False
    multi_gpu: bool = False
    enable_internet: bool = True
    dataset_slugs: list[str] = field(default_factory=list)
    include_data: list[str] = field(default_factory=list)
    extra_pip_deps: list[str] = field(default_factory=list)
    env_vars: dict[str, str] = field(default_factory=dict)
    kaggle_secrets: list[str] = field(default_factory=list)
    parent_kernels: list[str] = field(default_factory=list)
    output_dir: Path | None = None
    record_file: Path | None = None
    include_outputs: list[str] = field(default_factory=list)
    exclude_outputs: list[str] = field(default_factory=list)
    auto_dataset: bool = False
    auto_dataset_slug: str | None = None
    poll_interval: int = 20
    timeout_sec: int = 43200
```

## InteractiveClient

Client for communicating with active Kaggle Jupyter sessions:

```python
from kagglex import InteractiveClient

client = InteractiveClient(
    url="https://kkb-production.jupyter-proxy.kaggle.net/k/123/token=TOKEN",
    timeout=120,
)

# Test connectivity
is_alive, msg = client.test_connection()

# Query hardware
gpu_stats = client.get_gpu_info()

# Execute code snippet
result = client.execute_code("import torch; print(torch.cuda.is_available())")
print(result["stdout"])

# Transfer files
client.upload_file("./model.py")
client.download_file("metrics.json", local_path="./metrics.json")
```
