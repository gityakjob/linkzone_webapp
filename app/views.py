from app import templates, app
from fastapi import Request
from fastapi.responses import HTMLResponse, JSONResponse

from app.schemas import Pyload
from app.fnService import rpostSend

@app.post("/api/")
async def apiMr(pyload:dict = Pyload):
    data = rpostSend(pyload)
    return JSONResponse(content={"data": data})

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})