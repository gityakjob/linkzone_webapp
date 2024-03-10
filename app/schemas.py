from pydantic import BaseModel, Field, Required

class Pyload(BaseModel):
    jsonrpc:str = Field(Required)
    method:str = Field(Required)
    params:dict = Field(default=[])
    id:str = Field(Required)