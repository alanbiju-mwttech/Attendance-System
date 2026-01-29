from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from myapp import database, models, schemas

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