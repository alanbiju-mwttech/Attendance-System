from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from myapp import database, models, schemas
from sqlalchemy import func, extract
from datetime import datetime

router = APIRouter()

@router.post('/view-attendance')
def view_attendance(current_user: schemas.Current_User, db: Session = Depends(database.get_db)):
    try:
        attendance = db.query(models.Attendance.date, models.Attendance.status).filter(
            models.Attendance.user_id == current_user.user_id
        ).all()

        if not attendance:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Attendance has not been updated.')

        return [{"date": row.date, "status": row.status} for row in attendance]

    except:
        db.rollback()
        raise

@router.post('/user/leave-balance')
def leave_balance(current_user: schemas.Current_User, db: Session = Depends(database.get_db)):
    current_year = datetime.now().year

    sl_count = db.query(func.count(models.Attendance.attendance_id)).filter(
        models.Attendance.user_id == current_user.user_id,
        models.Attendance.status == "Sick Leave",
        extract('year', models.Attendance.date) == current_year
    ).scalar()

    el_count = db.query(func.count(models.Attendance.attendance_id)).filter(
        models.Attendance.user_id == current_user.user_id,
        models.Attendance.status == "Earned Leave",
        extract('year', models.Attendance.date) == current_year
    ).scalar()

    cl_count = db.query(func.count(models.Attendance.attendance_id)).filter(
        models.Attendance.user_id == current_user.user_id,
        models.Attendance.status == "Casual Leave",
        extract('year', models.Attendance.date) == current_year
    ).scalar()

    return {"cl_count": cl_count, "el_count": el_count, "sl_count": sl_count}

@router.get('/user/total-leaves')
def total_leaves(db: Session = Depends(database.get_db)):
    total_leaves = (
        db.query(
            models.Leave.leave_type,
            func.sum(models.Leave.number_of_days).label("total_days")
        )
        .group_by(models.Leave.leave_type)
        .all()
        )

    summary = {
        "casual": 0,
        "sick": 0,
        "earned": 0,
    }

    for leave_type, total in total_leaves:
        if "Casual" in leave_type:
            summary["casual"] = total
        elif "Sick" in leave_type:
            summary["sick"] = total
        elif "Earned" in leave_type:
            summary["earned"] = total

    return summary