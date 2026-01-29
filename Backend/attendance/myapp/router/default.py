from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date
from sqlalchemy.orm import Session
from myapp import database, models

def mark_all_absent():
    db: Session = database.SessionLocal()
    today = date.today()
    day_index = today.weekday()

    try:
        schedule = db.query(models.Work_Schedule).filter(
            models.Work_Schedule.day_of_week == day_index
        ).first()

        if not schedule:
            print(f"No work schedule set for weekday {day_index}")
            return

        users = db.query(models.User).all()

        for user in users:

            if not schedule.is_working: # type: ignore
                status = "WO"

            elif user.userid == 1: # type: ignore
                status = "PR"

            elif user.userid == 4: # type: ignore
                continue

            else:
                status = "AB"

            exists = db.query(models.Attendance).filter(
                models.Attendance.user_id == user.userid,
                models.Attendance.date == today
            ).first()

            if not exists:
                db.add(models.Attendance(
                    user_id=user.userid,
                    date=today,
                    status=status
                ))

        db.commit()

    except Exception as e:
        db.rollback()
        print("Attendance job failed:", e)

    finally:
        db.close()

scheduler = BackgroundScheduler()
scheduler.add_job(mark_all_absent, "cron", hour=10, minute=10)