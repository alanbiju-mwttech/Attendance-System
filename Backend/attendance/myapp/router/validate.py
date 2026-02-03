from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from myapp import database, models, schemas
from sqlalchemy import func, extract
from datetime import datetime

router = APIRouter()

@router.post('/check-reports-to')
def check_reports_to(current_user: schemas.Current_User, db: Session = Depends(database.get_db)):
    try:
        users = db.query(models.User).filter(models.User.reports_to == current_user.user_id).first()

        if users:
            return True
        else:
            return False
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Not able to check the database.')
    
@router.post('/check-absent-dates')
def check_absent_dates(current_user: schemas.Current_User, db: Session = Depends(database.get_db)):
    absent_dates = db.query(models.Attendance.date).filter(
        models.Attendance.user_id == current_user.user_id,
        models.Attendance.status == "Absent"
    ).all()

    return [row[0] for row in absent_dates]

@router.post('/check-pls')
def get_pl_count(current_user: schemas.Current_User, db: Session = Depends(database.get_db)):

    current_month = datetime.now().month
    current_year = datetime.now().year

    pl_count = db.query(func.count(models.Attendance.attendance_id)).filter(
        models.Attendance.user_id == current_user.user_id,
        models.Attendance.status == "Paid Leave",
        extract('month', models.Attendance.date) == current_month,
        extract('year', models.Attendance.date) == current_year
    ).scalar()

    total_leave = db.query(models.User.number_of_leaves).filter(models.User.userid == current_user.user_id).scalar()

    return {"pl_count": pl_count, "leave_count": total_leave}

@router.get('/leave-types')
def get_leave_types(db: Session = Depends(database.get_db)):
    leave = db.query(models.Leave).all()

    return [
        {"id": l.id, "type": l.leave_type}
        for l in leave
    ]