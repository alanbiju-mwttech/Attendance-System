from pydantic import BaseModel
from typing import List

class Login_Cred(BaseModel):
    username: str
    password: str

class Request(BaseModel):
    user_id: int
    request_date: str
    request_type: str
    comments: str

class Current_User(BaseModel):
    user_id: int

class Approve_Request(BaseModel):
    request_id: int
    user_id: int

class UserCreate(BaseModel):
        name: str
        username: str
        password: str
        roleid: int
        number_of_leaves: int
        reports_to: int

class WorkScheduleCreate(BaseModel):
    day_of_week: int
    is_working: bool
