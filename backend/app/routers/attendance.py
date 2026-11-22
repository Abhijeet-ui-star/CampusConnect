
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Attendance, Event, EventRegistration, User
from app.security import get_current_user

router = APIRouter(prefix="/attendance", tags=["Attendance"])


class QRCheckIn(BaseModel):
    app: str
    registration_id: int
    event_id: int


@router.post("/check-in")
def check_in(
    data: QRCheckIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if user.role not in ["organizer", "faculty", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")

    if data.app != "CampusConnect":
        raise HTTPException(status_code=400, detail="Invalid QR code")

    event = db.query(Event).filter(Event.id == data.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    registration = db.query(EventRegistration).filter(
        EventRegistration.id == data.registration_id,
        EventRegistration.event_id == data.event_id
    ).first()

    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")

    attendance = db.query(Attendance).filter(
        Attendance.event_id == data.event_id,
        Attendance.user_id == registration.user_id
    ).first()

    if attendance and attendance.status == "present":
        return {"message": "Student already checked in"}

    if attendance:
        attendance.status = "present"
        attendance.check_in_at = datetime.now(timezone.utc)
        attendance.marked_by = user.id
    else:
        attendance = Attendance(
            event_id=data.event_id,
            user_id=registration.user_id,
            status="present",
            check_in_at=datetime.now(timezone.utc),
            marked_by=user.id
        )
        db.add(attendance)

    db.commit()
    db.refresh(attendance)

    return {
        "message": "Attendance marked successfully!",
        "attendance_id": attendance.id,
        "event_id": attendance.event_id,
        "student_id": attendance.user_id,
        "status": attendance.status
    }


@router.get("/{event_id}")
def get_attendance(
    event_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if user.role not in ["organizer", "faculty", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")

    records = db.query(Attendance, User).join(
        User, Attendance.user_id == User.id
    ).filter(Attendance.event_id == event_id).all()

    return [
        {
            "attendance_id": attendance.id,
            "student_name": student.full_name,
            "email": student.email,
            "status": attendance.status,
            "check_in_at": attendance.check_in_at
        }
        for attendance, student in records
    ]
