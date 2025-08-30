from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import PrescriptionRequest, AnalysisResult, InteractionRequest, AlternativesRequest
from app.services import nlp, dosing, interactions, alternatives
import os

app = FastAPI(title="AI Medical Prescription Verifier (FastAPI)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get('/')
def root():
    return {'ok': True, 'service': 'AI Medical Prescription Verifier (FastAPI)', 'version': '1.0.0'}

@app.post('/api/analyze', response_model=AnalysisResult)
async def analyze(req: PrescriptionRequest):
    if not (req.prescriptionText or req.imageBase64):
        raise HTTPException(status_code=400, detail='Provide prescriptionText or imageBase64')
    # Step 1: extract drugs
    drugs = await nlp.extract_drugs(req.prescriptionText or '')
    # Step 2: dosing suggestions
    dosing_recs = dosing.get_recommendations(drugs, req.ageYears, req.weightKg)
    # Step 3: interactions
    interaction_res = interactions.check([d.name for d in drugs])
    # Step 4: alternatives
    alternative_res = alternatives.suggest([d.name for d in drugs])
    return AnalysisResult(
        drugs=drugs,
        interactions=interaction_res,
        dosageRecommendations=dosing_recs,
        alternativeSuggestions=alternative_res
    )

@app.post('/api/interactions')
async def check_interactions(req: InteractionRequest):
    return interactions.check(req.drugs)

@app.post('/api/alternatives')
async def get_alternatives(req: AlternativesRequest):
    return alternatives.suggest(req.drugs)
