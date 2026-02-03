from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, aliased
from myapp import database, models, schemas
from typing import cast

router = APIRouter()

@router.get("/admin/all-users")
def get_all_users(db: Session = Depends(database.get_db)):

    Manager = aliased(models.User)

    users = (
        db.query(
            models.User.userid,
            models.User.name,
            models.User.number_of_leaves,
            models.Role.role.label("role"),
            Manager.name.label("reports_to")
        )
        .join(models.Role, models.Role.roleid == models.User.roleid)
        .outerjoin(Manager, Manager.userid == models.User.reports_to)
        .order_by(models.User.userid, )
        .all()
    )

    result = []
    for u in users:
        result.append({
            "userid": u.userid,
            "name": u.name,
            "number_of_leaves": u.number_of_leaves,
            "role": u.role,
            "reports_to": u.reports_to
        })

    return result

@router.get('/admin/user/{user_id}/view')
def view_request(user_id: int, db: Session = Depends(database.get_db)):
    
    Manager = aliased(models.User)
    
    users = (
        db.query(
            models.User.userid,
            models.User.name,
            models.User.username,
            models.User.password,
            models.User.number_of_leaves,
            models.User.roleid,
            models.Role.role.label("role"),
            models.User.reports_to,
            models.User.schedule_id,
            models.Schedule.name.label("schedule_name"),
            Manager.name.label("reports_to_name")
        )
        .join(models.Role, models.Role.roleid == models.User.roleid)
        .join(models.Schedule, models.Schedule.id == models.User.schedule_id)
        .outerjoin(Manager, Manager.userid == models.User.reports_to)
        .filter(models.User.userid == user_id)
        .all()
    )
    
    result = []
    for u in users:
        result.append({
            "userid": u.userid,
            "name": u.name,
            "username": u.username,
            "password": u.password,
            "number_of_leaves": u.number_of_leaves,
            "roleid": u.roleid,
            "role": u.role,
            "reporting_manager": u.reports_to_name,
            "reports_to": u.reports_to,
            "schedule_id": u.schedule_id,
            "schedule_name": u.schedule_name
        })

    return result

@router.put('/admin/update-user/{user_id}')
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(database.get_db)):
    
    user = db.query(models.User).filter(models.User.userid == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return {"message" : "User Updated successfully.."}

@router.post('/admin/update-total-leaves')
def update_total_leaves(payload: schemas.Update_Leaves, db: Session = Depends(database.get_db)):
    print(payload)
    leave_map = {
        "Sick Leave": payload.sick,
        "Casual Leave": payload.casual,
        "Earned Leave": payload.earned
    }

    for leave_type, days in leave_map.items():
        leave_record = db.query(models.Leave).filter(models.Leave.leave_type == leave_type).first()

        if not leave_record:
            raise HTTPException(status_code=404, detail=f"{leave_type} not found")
        
        leave_record.number_of_days = cast(int, days) # type: ignore

    db.commit()
    return {"message": "Leave totals updated successfully"}