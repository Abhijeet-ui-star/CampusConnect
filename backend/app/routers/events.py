
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models import Event, EventRegistration, Attendance, User
from app.security import get_current_user

router = APIRouter(prefix="/events", tags=["Events"])


def check_permission(user):
    if user.role not in ["organizer", "faculty", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")


# 1. Get all approved events
@router.get("/")
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).filter(Event.status == "approved").all()


# 2. Create event
@router.post("/")
def create_event(
    title: str,
    description: str,
    category: str,
    venue: str,
    start_at: str,
    end_at: str,
    capacity: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    check_permission(user)

    start = datetime.fromisoformat(start_at)
    end = datetime.fromisoformat(end_at)

    if end <= start:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    if capacity < 1:
        raise HTTPException(status_code=400, detail="Capacity must be positive")

    event = Event(
        title=title,
        description=description,
        category=category,
        venue=venue,
        start_at=start,
        end_at=end,
        capacity=capacity,
        status="approved",
        created_by=user.id
    )

    db.add(event)
    db.commit()
    db.refresh(event)
    return event


# 3. Register for event
@router.post("/{event_id}/register")
def register_for_event(
    event_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.status == "approved"
    ).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    existing = db.query(EventRegistration).filter(
        EventRegistration.event_id == event_id,
        EventRegistration.user_id == user.id
    ).first()

    if existing:
        raise HTTPException(status_code=409, detail="Already registered")

    count = db.query(EventRegistration).filter(
        EventRegistration.event_id == event_id
    ).count()

    if count >= event.capacity:
        raise HTTPException(status_code=400, detail="Event is full")

    registration = EventRegistration(
        event_id=event_id,
        user_id=user.id,
        status="registered"
    )

    db.add(registration)
    db.commit()
    db.refresh(registration)

    return {
        "message": "Successfully registered!",
        "registration_id": registration.id,
        "event_id": event_id,
        "user_id": user.id,
        "status": registration.status
    }


# 4. My registrations
@router.get("/my-registrations")
def get_my_registrations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    registrations = (
        db.query(EventRegistration, Event)
        .join(Event, EventRegistration.event_id == Event.id)
        .filter(EventRegistration.user_id == user.id)
        .all()
    )

    return [
        {
            "registration_id": registration.id,
            "event_id": event.id,
            "title": event.title,
            "description": event.description,
            "category": event.category,
            "venue": event.venue,
            "start_at": event.start_at,
            "end_at": event.end_at,
            "capacity": event.capacity,
            "registration_status": registration.status,
            "registered_at": registration.registered_at
        }
        for registration, event in registrations
    ]


# 5. Edit event
@router.put("/{event_id}")
def update_event(
    event_id: int,
    title: str,
    description: str,
    category: str,
    venue: str,
    start_at: str,
    end_at: str,
    capacity: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    check_permission(user)

    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    start = datetime.fromisoformat(start_at)
    end = datetime.fromisoformat(end_at)

    if end <= start:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    if capacity < 1:
        raise HTTPException(status_code=400, detail="Capacity must be positive")

    event.title = title
    event.description = description
    event.category = category
    event.venue = venue
    event.start_at = start
    event.end_at = end
    event.capacity = capacity

    db.commit()
    db.refresh(event)

    return {"message": "Event updated successfully!", "event": event}


# 6. Delete event
@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    check_permission(user)

    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    try:
        db.query(Attendance).filter(
            Attendance.event_id == event_id
        ).delete(synchronize_session=False)

        db.query(EventRegistration).filter(
            EventRegistration.event_id == event_id
        ).delete(synchronize_session=False)

        db.delete(event)
        db.commit()

        return {"message": "Event deleted successfully!"}

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Cannot delete event because related records exist"
        )

@router.get("/{event_id}/registrations")
def get_event_registrations(
    event_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if user.role not in ["organizer", "faculty", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")

    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    records = (
        db.query(EventRegistration, User)
        .join(User, EventRegistration.user_id == User.id)
        .filter(EventRegistration.event_id == event_id)
        .all()
    )

    return [
        {
            "registration_id": registration.id,
            "student_id": student.id,
            "student_name": student.full_name,
            "email": student.email,
            "status": registration.status
        }
        for registration, student in records
    ]

