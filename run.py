import uvicorn
import os
hostipapi="0.0.0.0"
portipapi=8080
DEBUG=True
if __name__ == '__main__':
    uvicorn.run("app:app",
            host=hostipapi,
            port=portipapi,
            #ssl_keyfile=key,
            #ssl_certfile=crt,
            #log_level='error',
            #loop='asyncio',
            #workers=4,
            #limit_concurrency=10,
            #limit_max_requests=30,
            lifespan='on',
            #timeout_keep_alive=25,
            reload=DEBUG
            )
