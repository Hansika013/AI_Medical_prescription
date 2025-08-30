from typing import List
from app.models import DosageRecommendation, Drug

def get_recommendations(drugs: List[Drug], ageYears: int = None, weightKg: float = None):
    recs = []
    for d in drugs:
        name = d.name.lower()
        if name == 'paracetamol':
            if ageYears is not None and ageYears < 12 and weightKg:
                per_dose = round(weightKg * 15)
                recs.append(DosageRecommendation(
                    drug='paracetamol',
                    recommendedDose=f'{per_dose} mg per dose, every 4–6 hours (max 60 mg/kg/day)',
                    rationale='Pediatric dose ~10–15 mg/kg per dose.',
                    ageAdjusted=True,
                    weightAdjusted=True
                ))
            else:
                recs.append(DosageRecommendation(
                    drug='paracetamol',
                    recommendedDose='500–1000 mg every 4–6 hours as needed (max 3000 mg/day)',
                    rationale='Typical adult dosing. Reduce max in hepatic impairment.',
                    ageAdjusted=ageYears is not None,
                    weightAdjusted=False
                ))
        elif name == 'ibuprofen':
            if ageYears is not None and ageYears < 12 and weightKg:
                per_dose = round(weightKg * 10)
                recs.append(DosageRecommendation(
                    drug='ibuprofen',
                    recommendedDose=f'{per_dose} mg per dose, every 6–8 hours (max 40 mg/kg/day)',
                    rationale='Pediatric dose ~5–10 mg/kg per dose.',
                    ageAdjusted=True,
                    weightAdjusted=True
                ))
            else:
                recs.append(DosageRecommendation(
                    drug='ibuprofen',
                    recommendedDose='200–400 mg every 6–8 hours with food (max 1200 mg/day OTC)',
                    rationale='Typical adult OTC dosing.',
                    ageAdjusted=ageYears is not None,
                    weightAdjusted=False
                ))
        elif name == 'amoxicillin':
            if ageYears is not None and ageYears < 12 and weightKg:
                per_day = round(weightKg * 45)
                recs.append(DosageRecommendation(
                    drug='amoxicillin',
                    recommendedDose=f'{per_day} mg/day divided q12h (standard); up to 80–90 mg/kg/day for otitis media',
                    rationale='Pediatric dosing is weight-based.',
                    ageAdjusted=True,
                    weightAdjusted=True
                ))
            else:
                recs.append(DosageRecommendation(
                    drug='amoxicillin',
                    recommendedDose='500 mg every 8 hours or 875 mg every 12 hours',
                    rationale='Typical adult dosing for common infections.',
                    ageAdjusted=ageYears is not None,
                    weightAdjusted=False
                ))
        else:
            # Unknown drug: no recommendation
            continue
    return recs
