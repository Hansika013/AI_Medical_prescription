from typing import List
from app.models import DrugInteraction
from app.services.knowledge_base import INTERACTIONS

def check(drug_names: List[str]) -> List[DrugInteraction]:
    lowered = [d.lower() for d in drug_names]
    out = []
    for a in lowered:
        rules = INTERACTIONS.get(a, [])
        for rule in rules:
            if rule['with'].lower() in lowered:
                out.append(DrugInteraction(pair=[a, rule['with'].lower()], severity=rule['severity'], explanation=rule['explanation']))
    # dedupe pairs
    seen = set()
    filtered = []
    for r in out:
        key = '|'.join(sorted(r.pair))
        if key in seen: continue
        seen.add(key)
        filtered.append(r)
    return filtered
