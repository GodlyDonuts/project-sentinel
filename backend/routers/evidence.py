from fastapi import APIRouter
from services.storage import list_evidence, get_evidence

router = APIRouter()

@router.get("")
async def get_evidence_list():
    return list_evidence()

@router.get("/{filename}")
async def get_evidence_file(filename: str):
    report = get_evidence(filename)
    if not report:
        return {"error": "File not found"}
    return report
