# app/llm.py
import os
import json
import traceback
import requests
from types import SimpleNamespace
 
# try OpenAI as fallback (keeps original fallback behavior)
try:
    from langchain import OpenAI
    _have_openai = True
except Exception:
    OpenAI = None
    _have_openai = False
 
# --- FPT Cloud wrapper ---
class FPTLLM:
    """
    Minimal wrapper to call FPT AI Marketplace chat completions endpoint.
    Provides:
      - invoke(prompt, system_prompt=...) -> object with .content (string)
      - generate([prompt1, prompt2...]) -> object with .generations (list of list) where each item has .text
      - __call__(prompt) -> returns string
    Note: Do NOT commit API keys to public repos.
    """
    def __init__(self, api_key: str, model: str = "Llama-3.3-70B-Instruct", base_url: str = None, timeout: int = 60):
        self.api_key = api_key
        self.model = model
        self.base_url = base_url or "https://m...content-available-to-author-only...d.com"
        self.timeout = timeout
        # Correct chat endpoint for FPT
        self._completions_url = f"{self.base_url.rstrip('/')}/v1/chat/completions"
        # Optional default generation params
        self.default_params = {
            "max_tokens": 1024,
            "temperature": 1,
        }
 
    def _post(self, payload: dict):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        resp = requests.post(self._completions_url, json=payload, headers=headers, timeout=self.timeout)
        resp.raise_for_status()
        return resp.json()
 
    def invoke(self, prompt: str, system_prompt: str = None, **kwargs):
        """
        Send a chat-style request to FPT Cloud.
        Returns SimpleNamespace(content=<str>, raw=<json>)
        """
        # merge params
        params = {**self.default_params, **kwargs}
 
        # build messages array
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
 
        # build request body
        body = {
            "model": self.model,
            "messages": messages,
            "max_tokens": int(params.get("max_tokens", 1024)),
            "temperature": float(params.get("temperature", 0.0)),
        }
 
        # include optional generation args if provided
        for key in ("top_p", "n", "stop"):
            if key in params and params[key] is not None:
                body[key] = params[key]
 
        # Debug prints (uncomment for troubleshooting)
        # print("FPT URL:", self._completions_url)
        # print("FPT BODY:", json.dumps(body, ensure_ascii=False, indent=2))
 
        # POST and handle errors
        try:
            resp = requests.post(self._completions_url, json=body, headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }, timeout=self.timeout)
            resp.raise_for_status()
            data = resp.json()
        except requests.HTTPError as e:
            msg = f"HTTPError: {e}"
            try:
                msg += " | " + resp.text
            except:
                pass
            return SimpleNamespace(content=f"Xin lỗi, AI gặp lỗi HTTP khi gọi FPT: {msg}", raw={"error": str(e), "resp_text": getattr(resp, "text", "")})
        except Exception as e:
            return SimpleNamespace(content=f"Xin lỗi, lỗi khi gọi FPT: {e}", raw={"error": str(e)})
 
        # parse response — support common shapes
        text = None
        if isinstance(data, dict):
            # OpenAI-like chat response: choices[0].message.content
            choices = data.get("choices")
            if isinstance(choices, list) and len(choices) > 0:
                first = choices[0]
                # try chat message
                if isinstance(first, dict):
                    msg = first.get("message") or first.get("delta")
                    if isinstance(msg, dict) and msg.get("content"):
                        text = msg.get("content")
                    elif first.get("text"):
                        text = first.get("text")
                    elif isinstance(first.get("delta"), dict) and first["delta"].get("content"):
                        text = first["delta"]["content"]
 
            # fallbacks
            if text is None:
                if "output" in data:
                    out = data["output"]
                    if isinstance(out, list):
                        text = "\n".join(map(str, out))
                    else:
                        text = str(out)
                elif "result" in data:
                    text = str(data["result"])
                elif "output_text" in data:
                    text = str(data["output_text"])
 
        if text is None:
            # final fallback: stringify entire response
            try:
                text = json.dumps(data, ensure_ascii=False)
            except:
                text = str(data)
 
        return SimpleNamespace(content=text, raw=data)
 
    def generate(self, prompts: list, system_prompt: str = None, **kwargs):
        gens = []
        for p in prompts:
            res = self.invoke(p, system_prompt=system_prompt, **kwargs)
            gens.append([SimpleNamespace(text=res.content)])
        return SimpleNamespace(generations=gens, raw=gens)
 
    def __call__(self, prompt: str, **kwargs):
        return self.invoke(prompt, **kwargs).content
 
 
# Factory function
def get_llm():
    """
    Return an instantiated LLM.
    Preference: FPT_API_KEY (env) else fallback to hardcoded (for local testing).
    """
    # try env first
    fpt_key = os.environ.get("FPT_API_KEY") or os.environ.get("FPT_APIKEY") or os.environ.get("FPT_KEY")
 
    # fallback to hardcoded key (if env not set). KEEP PRIVATE.
    if not fpt_key:
        # ---- EDIT HERE IF YOU WANT TO HARDCODE (DO NOT COMMIT) ----
        fpt_key = "sk-dQgK8TSQKIbmOi8LTimHeFnk9REw6ecxrQXH5HwwdhhUKr96"
        # ----------------------------------------------------------
 
    if fpt_key:
        model = os.environ.get("FPT_MODEL", "Llama-3.3-70B-Instruct")
        base = os.environ.get("FPT_BASE_URL", "https://m...content-available-to-author-only...d.com")
        try:
            llm = FPTLLM(api_key=fpt_key, model=model, base_url=base)
            return llm
        except Exception as e:
            print(f"[llm.py] FPTLLM init failed: {e}")
            traceback.print_exc()
 
    # Optional fallback to OpenAI (if langchain installed and OPENAI_API_KEY set)
    if _have_openai and os.environ.get("OPENAI_API_KEY"):
        print("[llm.py] Falling back to OpenAI LLM")
        return OpenAI(model_name=os.environ.get("OPENAI_MODEL", "gpt-3.5-turbo"),
                      openai_api_key=os.environ.get("OPENAI_API_KEY"))
 
    raise RuntimeError("No usable LLM found. Set FPT_API_KEY (preferred) or configure OpenAI with OPENAI_API_KEY.")