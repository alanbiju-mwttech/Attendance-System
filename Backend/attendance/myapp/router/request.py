from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from myapp import database, models, schemas

router = APIRouter()

@router.post('/send-request')
def send_request(request_details: schemas.Request, db: Session = Depends(database.get_db)):
    print(request_details)
    try:
        attendance = db.query(models.Attendance).filter(
            models.Attendance.user_id == request_details.user_id,
            models.Attendance.date == request_details.request_date
        ).first()

        if not attendance:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Attendance has not been updated for this date.')
        
        attendance_request = models.Requests(
            user_id = request_details.user_id,
            request_date = request_details.request_date,
            request_type = request_details.request_type,
            comments = request_details.comments,
            status = "Pending"
        )

        db.add(attendance_request)
        db.commit()
        db.refresh(attendance_request)

        raise HTTPException(
            status_code=201,
            detail="Request registered successfully.")
    
    except:
        db.rollback()
        raise

@router.post('/get-requests')
def get_requests(current_user: schemas.Current_User, db: Session = Depends(database.get_db)):
    
    try:
        requests = (
            db.query(models.Requests)
            .join(models.User, models.User.userid == models.Requests.user_id)
            .filter(
                models.User.reports_to == current_user.user_id,
                models.Requests.status == "Pending"
            )
            .all()
        )
        return requests

    except:
        db.rollback()
        raise

@router.get('/request/{request_id}/view')
def view_request(request_id: int, db: Session = Depends(database.get_db)):
    request = db.query(models.Requests).filter(models.Requests.request_id == request_id).first()

    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Request not found.')
    
    return request

@router.post('/request/approve')
def approve_request(approve_details: schemas.Approve_Request, db: Session = Depends(database.get_db)):
    
    try:
        request = db.query(models.Requests).filter(models.Requests.request_id == approve_details.request_id).first()
        if not request:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Request not found.')
        
        approve_request = models.Request_Approval(
            request_id = approve_details.request_id,
            user_id = approve_details.user_id,
            action = "Approved"
        )

        db.add(approve_request)
        db.commit()
        db.refresh(approve_request)

        request.status = "Approved" # type: ignore
        
        attendance = db.query(models.Attendance).filter(
            models.Attendance.user_id == request.user_id,
            models.Attendance.date == request.request_date
        ).first()

        attendance.status = request.request_type # type: ignore
        attendance.request_id = request.request_id # type: ignore

        db.commit()

    except:
        db.rollback()
        raise

@router.post('/request/reject')
def approve_reject(approve_details: schemas.Approve_Request, db: Session = Depends(database.get_db)):
    
    try:
        request = db.query(models.Requests).filter(models.Requests.request_id == approve_details.request_id).first()
        if not request:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Request not found.')
        
        reject_request = models.Request_Approval(
            request_id = approve_details.request_id,
            user_id = approve_details.user_id,
            action = "Rejected"
        )

        db.add(reject_request)
        db.commit()
        db.refresh(reject_request)

        request.status = "Rejected" # type: ignore
        
        attendance = db.query(models.Attendance).filter(
            models.Attendance.user_id == request.user_id,
            models.Attendance.date == request.request_date
        ).first()
        
        attendance.request_id = request.request_id # type: ignore
        attendance.status = "LOP" # type: ignore

        db.commit()

    except:
        db.rollback()
        raise