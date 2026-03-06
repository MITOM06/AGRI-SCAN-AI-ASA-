# app/rag.py
import os, json
from pathlib import Path
from typing import List, Tuple

# keep same imports used trong run-model.py to minimize change
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
KB_PATH = DATA_DIR / "plant_knowledge.json"

def load_knowledge(kb_path: Path = KB_PATH):
    if not kb_path.exists():
        raise FileNotFoundError(f"Knowledge JSON not found at {kb_path}")
    with open(kb_path, "r", encoding="utf-8") as f:
        kb = json.load(f)
    return kb

# create embeddings & vector DB (cached)
_vectorstore = None
def init_vector_db(emb_model_name: str = None, force: bool = False):
    """
    Build a Chroma vectorstore from the JSON knowledge base.
    Returns the vectorstore object.
    """
    global _vectorstore
    if _vectorstore is not None and not force:
        return _vectorstore

    emb_model = emb_model_name or os.environ.get("HF_EMBEDDINGS_MODEL", "keepitreal/vietnamese-sbert")
    embeddings = HuggingFaceEmbeddings(model_name=emb_model)

    kb = load_knowledge()
    docs = []
    for key, data in kb.items():
        # only include non-normal entries (same logic as original)
        if data.get("Status") != "Normal":
            content = (
                f"Bệnh: {data.get('LOAI_BENH')}. "
                f"Triệu chứng: {data.get('DAC_DIEM')}. "
                f"Cách trị: {data.get('GIAI_PHAP')}. "
                f"Thuốc: {data.get('LIEU_TRINH_VA_THUOC', {}).get('Hoat_chat_dac_tri', '')}"
            )
            meta = {"class_name": key, "ten_cay": data.get("TEN_CAY")}
            docs.append(Document(page_content=content, metadata=meta))

    if not docs:
        print("[rag.py] Warning: no docs created from KB.")
    vs = Chroma.from_documents(docs, embeddings)
    _vectorstore = vs
    return vs

def query_vectorstore(vectorstore, query: str, k: int = 3):
    """
    Return top-k documents (metadata + content) for the query.
    """
    # for Chroma from langchain-community, use .similarity_search_with_score or .similarity_search
    try:
        results = vectorstore.similarity_search_with_score(query, k=k)
    except Exception:
        # try alternative API
        results = vectorstore.similarity_search(query, k=k)
    # results: list of (Document, score) or Document
    out = []
    for item in results:
        if isinstance(item, tuple) and len(item) == 2:
            doc, score = item
        else:
            doc, score = item, None
        out.append({"content": doc.page_content, "metadata": dict(doc.metadata), "score": score})
    return out