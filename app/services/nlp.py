import os
from typing import List
from app.models import Drug
from app.services.knowledge_base import DRUGS
import httpx

HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')

async def extract_drugs(text: str) -> List[Drug]:
    """Try Hugging Face inference API for NER. If API key not set, fallback to simple rule-based extraction."""
    if not text:
        return []
    text = text.strip()
    # If HF key available, call HF inference endpoint (NER) - model choice left to you
    if HUGGINGFACE_API_KEY:
        url = 'https://api-inference.huggingface.co/models/d4data/biomedical-ner-all'  # example biomedical NER
        headers = {'Authorization': f'Bearer {HUGGINGFACE_API_KEY}'}
        payload = {'inputs': text}
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(url, headers=headers, json=payload)
                resp.raise_for_status()
                ents = resp.json()
                # ents expected: list of {entity, score, index, word, start, end}
                found = []
                for e in ents:
                    word = e.get('word') or e.get('entity') or ''
                    if not word:
                        continue
                    # naive filter for medications
                    w = word.lower()
                    for key, info in DRUGS.items():
                        if w in [a.lower() for a in info['aliases']]:
                            found.append(key)
                # dedup preserve order
                seen = []
                drugs = []
                for k in found:
                    if k in seen: continue
                    seen.append(k)
                    info = DRUGS[k]
                    drugs.append(Drug(name=k, description=info['description'], classes=info['classes']))
                return drugs
        except Exception as e:
            print('HF NER failed, falling back to rule-based:', e)

    # Fallback simple rule-based scan: look for aliases in text
    lower = text.lower()
    found = []
    for key, info in DRUGS.items():
        for alias in info['aliases']:
            if alias in lower:
                found.append(key)
                break
    # build Drug objects
    seen = []
    out = []
    for k in found:
        if k in seen: continue
        seen.append(k)
        info = DRUGS[k]
        out.append(Drug(name=k, description=info['description'], classes=info['classes']))
    return out

# Placeholder for IBM Granite / watsonx.ai integration if desired.
WATSONX_API_KEY = os.getenv('WATSONX_API_KEY')
WATSONX_URL = os.getenv('WATSONX_URL')
async def call_watsonx(prompt: str) -> str:
    if not WATSONX_API_KEY or not WATSONX_URL:
        return ''
    headers = {'Authorization': f'Bearer {WATSONX_API_KEY}'}
    payload = {'input': prompt}
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(WATSONX_URL, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
        # Adjust based on watsonx response format
        return data.get('generated_text') or ''
