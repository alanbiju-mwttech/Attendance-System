from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from myapp import database, models, schemas

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
        models.Attendance.status == "AB"
    ).all()

    return [row[0] for row in absent_dates] 