from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Date
from myapp.database import Base
from datetime import datetime
from sqlalchemy.sql import func

class Role(Base):
    
    __tablename__ = "role"

    roleid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role = Column(String, nullable=False, index=True)

class User(Base):

    __tablename__ = "user"

    userid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    roleid = Column(Integer, ForeignKey("role.roleid"))
    name = Column(String, nullable=False, index=True)
    username = Column(String, nullable=False, index=True)
    password = Column(String, nullable=False, index=True)
    number_of_leaves = Column(Integer, nullable=False, index=True)
    reports_to = Column(Integer, ForeignKey("user.userid"), nullable=True)

class Work_Schedule(Base):

    __tablename__ = "work_schedule"

    schedule_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    day_of_week = Column(Integer, nullable=False, index=True)
    is_working = Column(Boolean, nullable=False, index=True)

class Requests(Base):

    __tablename__ = "requests"

    request_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.userid"))
    request_date = Column(Date, nullable=False, index=True)
    request_type = Column(String, nullable=False, index=True)
    comments = Column(String, index=True)
    status = Column(String, nullable=False, index=True)
    applied_at = Column(DateTime, default=lambda: datetime.now().replace(microsecond=0))

class Request_Approval(Base):

    __tablename__ = "request_approval"

    approval_id  = Column(Integer, primary_key=True, index=True, autoincrement=True)
    request_id = Column(Integer, ForeignKey("requests.request_id"))
    user_id = Column(Integer, ForeignKey("user.userid"))
    action = Column(String, nullable=False, index=True)
    approved_at = Column(DateTime, default=lambda: datetime.now().replace(microsecond=0))

class Attendance(Base):

    __tablename__ = "attendance"

    attendance_id  = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.userid"))
    date = Column(Date, server_default=func.current_date())
    status = Column(String, nullable=False, index=True)
    request_id = Column(Integer, ForeignKey("requests.request_id"))