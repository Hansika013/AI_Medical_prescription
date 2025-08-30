from typing import List
from app.models import AlternativeSuggestion
from app.services.knowledge_base import ALTERNATIVES

def suggest(drug_names: List[str]) -> List[AlternativeSuggestion]:
    out = []
    for d in [x.lower() for x in drug_names]:
        alts = ALTERNATIVES.get(d, [])
        for a in alts:
            out.append(AlternativeSuggestion(forDrug=d, suggestion=a['suggestion'], reason=a['reason']))
    return out
