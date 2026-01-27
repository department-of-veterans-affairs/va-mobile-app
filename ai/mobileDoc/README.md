# LM Sandbox
This is an implementation attempting to write our own LM workflow to handle mobile doc site and have a LM answer questions on it to make onboarding and questions easier to answer.

## Workflow thought process
 - Longchain - load documents, consume data(split text and embed chunks)
 - Ollama - convert chunks to numerical vector aka embedding  
 - ChromaDB(vector db) - store into vector database 
 - Ollama - user facing UI for sandbox? Or just make it a terminal prompt?
## Install
- [UV](https://docs.astral.sh/uv/guides/install-python/)
- Python 3.14.2

## Run
```shell
uv run python main.py
```

## Installing libraries
```shell
// Added library
uv add your-library

// Remove library
 uv remove your-library
```