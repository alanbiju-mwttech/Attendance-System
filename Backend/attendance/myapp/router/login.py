from fastapi import APIRouter, Depends, HTTPException, status
from myapp import schemas, database, models
from sqlalchemy.orm import Session

router = APIRouter()

@router.post('/login')
def login(login_details: schemas.Login_Cred, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == login_details.username, models.User.password == login_details.password).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Wrong username or password')

    role = db.query(models.Role).filter(models.Role.roleid == user.roleid).first()
    return {"user_id": user.userid, "role": role.role, "isLoggedIn": True} # type: ignore

@router.get("/get-roles")
def get_roles(db: Session = Depends(database.get_db)):
    roles = db.query(models.Role).all()

    return roles

@router.get('/get-work-schedules')
def get_work_schedules(db: Session = Depends(database.get_db)):
    schedules = db.query(models.Schedule).all()

    return schedules

@router.get("/get-users")
def get_users(db: Session = Depends(database.get_db)):
    users = db.query(models.User).all()

    return users

@router.post("/add-user")
def add_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    new_user = models.User(
        roleid=user.roleid,
        name=user.name,
        username=user.username,
        password=user.password,
        number_of_leaves=user.number_of_leaves,
        reports_to=user.reports_to,
        schedule_id=user.schedule_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@router.get("/get-work-schedule")
def get_work_schedule(db: Session = Depends(database.get_db)):
    return db.query(models.Work_Schedule).all()


@router.post("/set-work-schedule")
def set_work_schedule(schedule: schemas.WorkScheduleCreate, db: Session = Depends(database.get_db)):
    try:
        active = (
            db.query(models.Schedule)
            .filter(models.Schedule.isActive == True)
            .first()
        )

        if active:
            active.isActive = False # type: ignore

        newSchedule = models.Schedule(
            name=schedule.name,
            isActive=True
        )

        db.add(newSchedule)
        db.commit()
        db.refresh(newSchedule)

        for day in schedule.steps:
            db.add(models.Work_Schedule(
                day_of_week=day.day_of_week,
                is_working=day.is_working,
                schedule_id=newSchedule.id
            ))

        db.commit()
        return {"message": "Work schedule added successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))