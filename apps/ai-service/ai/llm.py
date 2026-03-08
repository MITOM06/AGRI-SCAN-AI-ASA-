# app/llm.py
import os
import traceback

# try Ollama first (used in original run-model.py)
try:
    from langchain_ollama import OllamaLLM
    _have_ollama = True
except Exception:
    OllamaLLM = None
    _have_ollama = False

# try OpenAI as fallback
try:
    from langchain import OpenAI
    _have_openai = True
except Exception:
    OpenAI = None
    _have_openai = False

def get_llm():
    """
    Return an instantiated LLM. Preference order:
      1) OllamaLLM if OLLAMA_MODEL set and ollama available and model reachable
      2) OpenAI if OPENAI_API_KEY in env and langchain installed
    Raise if neither available.
    """
    # 1) Ollama
    if _have_ollama:
        model = os.environ.get("OLLAMA_MODEL", "qwen2:7b")
        try:
            llm = OllamaLLM(model=model)
            # optionally try a tiny sanity call (non-blocking) - many Ollama clients will error on generate if model missing
            return llm
        except Exception as e:
            print(f"[llm.py] OllamaLLM init failed for model={model}: {e}")
            traceback.print_exc()

    # 2) OpenAI fallback
    if _have_openai and os.environ.get("OPENAI_API_KEY"):
        print("[llm.py] Falling back to OpenAI LLM")
        return OpenAI(model_name=os.environ.get("OPENAI_MODEL", "gpt-3.5-turbo"),
                      openai_api_key=os.environ.get("OPENAI_API_KEY"))
    # nothing
    raise RuntimeError("No usable LLM found. Install/configure Ollama or OpenAI and set OLLAMA_MODEL or OPENAI_API_KEY.")