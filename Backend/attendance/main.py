from myapp import database, models
from fastapi.middleware.cors import CORSMiddleware
from myapp.router import default
from fastapi import FastAPI
from myapp.router.default import scheduler
from myapp.router import request, login, attendance, validate, admin

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
def start_scheduler():
    scheduler.start()

app.include_router(login.router)
app.include_router(request.router)
app.include_router(attendance.router)
app.include_router(validate.router)
app.include_router(admin.router)