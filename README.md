# AI Medical Prescription Verifier - FastAPI Backend (Demo)

This is a demo backend written in **Python (FastAPI)**. It provides endpoints to:
- analyze prescriptions (drug extraction, interaction checks, dosing suggestions, alternatives)
- check interactions
- list alternatives

**Important:** This is an educational demo — NOT a medical device. Replace the simple rules and KB with validated clinical sources for production.

## Quick start

1. Copy `.env.example` -> `.env` and fill your API keys (Hugging Face, IBM Granite / watsonx if used).
2. Create and activate venv:
   ```bash
   python -m venv venv
   source venv/bin/activate   # on Windows: venv\Scripts\activate
   ```
3. Install:
   ```bash
   pip install -r requirements.txt
   ```
4. Run:
   ```bash
   uvicorn app.main:app --reload --port 5050
   ```

## Endpoints

POST /api/analyze
POST /api/interactions
POST /api/alternatives

See app/README.md for more details.
