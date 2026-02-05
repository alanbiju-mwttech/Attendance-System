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

    leave_types = [row[0] for row in db.query(models.Leave.leave_type).all()]

    balance = {}
    for leave_type in leave_types:
        count = db.query(func.count(models.Attendance.attendance_id)).filter(
            models.Attendance.user_id == current_user.user_id,
            models.Attendance.status == leave_type,
            extract('year', models.Attendance.date) == current_year
        ).scalar()

        balance[leave_type] = count

    return balance

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

    summary = {}

    for leave_type, total in total_leaves:
        summary[leave_type] = total

    return summary