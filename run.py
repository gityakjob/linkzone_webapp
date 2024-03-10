import uvicorn
import os
hostipapi=os.environ.get("HOST", "0.0.0.0")
portipapi=int(os.environ.get("PORT", "8080"))
DEBUG=bool(os.environ.get("DEBUG", 1))
if __name__ == '__main__':
    uvicorn.run("app:app",
            host=hostipapi,
            port=portipapi,
            lifespan='on',
            reload=DEBUG
            )
