from pydantic import BaseModel
from typing import List, Optional

class PrescriptionRequest(BaseModel):
    prescriptionText: Optional[str] = None
    imageBase64: Optional[str] = None
    ageYears: Optional[int] = None
    weightKg: Optional[float] = None

class Drug(BaseModel):
    name: str
    description: Optional[str] = None
    classes: Optional[List[str]] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None

class DrugInteraction(BaseModel):
    pair: List[str]
    severity: str
    explanation: str

class DosageRecommendation(BaseModel):
    drug: str
    recommendedDose: str
    rationale: str
    ageAdjusted: bool
    weightAdjusted: bool

class AlternativeSuggestion(BaseModel):
    forDrug: str
    suggestion: str
    reason: str

class AnalysisResult(BaseModel):
    drugs: List[Drug]
    interactions: List[DrugInteraction]
    dosageRecommendations: List[DosageRecommendation]
    alternativeSuggestions: List[AlternativeSuggestion]

class InteractionRequest(BaseModel):
    drugs: List[str]

class AlternativesRequest(BaseModel):
    drugs: List[str]
