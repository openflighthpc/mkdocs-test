## Overview

A test of `mkdocs` for hosting the OpenFlight docs

## Setup

### Linux Machine/VM

- Install mkdocs 
  ```bash
  pip install mkdocs
  ```
- Install mkdocs material theme (provides versioning and extensible features) 
  ```bash
  pip install mkdocs-material
  ```
- Install mike version manager (allows multiple versions of documentation to exist) 
  ```bash
  pip install mike
  ```
- Install includes plugin to support page partials
  ```bash
  pip install mkdocs-macros-plugin
  ```
- Ensure correct default branch being used by mike
  ```bash
  mike set-default latest
  ```

### Container
- Prerequisite
  `docker and docker-compose`

- Start the application
  ```bash
  # To run in foregorund
  cd docs.openflighthpc.org
  docker compose up
  
  # To run in background
  cd docs.openflighthpc.org
  docker compose up -d 
  ```

- Stop the application
  ```bash
  # Stop foregrond app
  stop the process using ctrl+c
  
  # Stop background app
  cd docs.openflighthpc.org
  docker compose down
  ```

- Access application
  ```bash
  http://<machine_ip>:8000
  ```
  
- Run application on a different port
  ```bash
  vi docker-compose.yml
  version: '3'
  services:
    mkdocs:
      image: danghpc/mkdocs-image:latest
      ports:
        - "<set-port-no>:8000"
      volumes:
        - .:/app/
    
    # save the file and run docker-compose up 
  ```

## Build Dockerfile
- Run the command to build docker image
```bash
  cd docs.openflighthpc.org
  docker build -t <repo-name>/<image-name>:<tag> . 
  ```
## Viewing Docs

To view your WIP documentation locally simply use `mkdocs serve` which will update as docs are changed. 

To view the versioned documentation (managed by `mike`) run `mike serve` (note: this will not auto-update as docs are changed and requires redeploying).

## Writing Docs

It's worth familiarising with the [available markdown formatting](https://www.mkdocs.org/user-guide/writing-your-docs/#writing-with-markdown) supported by mkdocs. This documentation has the following plugins installed:


## Deploying Docs

Using `mike` we can deploy documentation with version tagging

- Deploy WIP data to `staging` 
```
mike deploy --push --update-aliases 20XX.Y staging
```

- Deploy a new stable version of documentation
```
mike deploy --push --update-aliases 20XX.Y latest
```

- Resetting/removing a version 
```
mike delete --push 20XX.Y
```

## Content Things to Look Into

- Code Annotations (adds pop-ups with notes on commands/info) 
    - See "Code annotations" in material docs
- Rename sections to prettier naming