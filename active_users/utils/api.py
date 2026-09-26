# Active Users © 2023
# Author:  Ameen Ahmed
# Company: Level Up Marketing & Software Development Services
# Licence: Please refer to LICENSE file


import frappe
from frappe import _, _dict
from frappe.utils import (
    cint,
    has_common,
    now,
    add_to_date,
    get_datetime,
    now_datetime
)

from .common import (
    _SETTINGS_,
    _CACHE_,
    _CACHE_INTERVAL_,
    settings,
    get_cache,
    set_cache,
    del_cache,
    log_error
)


@frappe.whitelist()
def get_settings():
    cache_key = "settings"
    cache = get_cache(_CACHE_, cache_key)
    
    if cache and isinstance(cache, dict):
        return cache
    
    result = _dict({
        "enabled": 0,
        "refresh_interval": 5,
        "allow_manual_refresh": 0
    })
    status = 0
    app = settings()
    
    if not cint(app.enabled):
        status = 2
    
    if not status and app.users:
        users = [v.user for v in app.users]
        if users and frappe.session.user in users:
            status = 2 if cint(app.hidden_from_listed_users) else 1
    
    if not status and app.roles:
        roles = [v.role for v in app.roles]
        if roles and has_common(roles, frappe.get_roles()):
            status = 2 if cint(app.hidden_from_listed_roles) else 1
            
    if status == 1:
        result.enabled = 1
        result.refresh_interval = cint(app.refresh_interval)
        result.allow_manual_refresh = 1 if cint(app.allow_manual_refresh) else 0
    
    set_cache(_CACHE_, cache_key, result)
    return result


@frappe.whitelist()
def get_users(force=0):
    app = settings()
    
    if not cint(app.enabled):
        return {"users": []}
    
    cache_key = "users"
    
    # If forced or manual refresh, purge cache
    if cint(force):
        del_cache(_CACHE_, cache_key)
    elif app.refresh_interval >= _CACHE_INTERVAL_:
        cache = get_cache(_CACHE_, cache_key)
        if cache and isinstance(cache, dict):
            if get_datetime(cache.expiry) >= now_datetime():
                return {"users": cache.data}
            del_cache(_CACHE_, cache_key)
    
    # Active window: user must have active session within recent window (default 15 minutes)
    window_minutes = max(cint(app.refresh_interval) * 2, 15)
    cutoff = add_to_date(now(), minutes=-window_minutes, as_string=True, as_datetime=True)
    
    try:
        # Check active sessions in tabSessions
        active_session_users = frappe.db.sql(
            """
            SELECT DISTINCT user FROM `tabSessions`
            WHERE status = 'Active'
              AND user != 'Guest'
              AND user != %(current_user)s
              AND lastupdate >= %(cutoff)s
            """,
            {"current_user": frappe.session.user, "cutoff": cutoff},
            pluck=True,
        )
        
        # Also check User.last_active where session exists (handles deferred db sync)
        recent_active_users = frappe.db.sql(
            """
            SELECT DISTINCT s.user FROM `tabSessions` s
            INNER JOIN `tabUser` u ON u.name = s.user
            WHERE s.status = 'Active'
              AND s.user != 'Guest'
              AND s.user != %(current_user)s
              AND u.last_active >= %(cutoff)s
            """,
            {"current_user": frappe.session.user, "cutoff": cutoff},
            pluck=True,
        )
        
        candidate_users = list(set(active_session_users + recent_active_users))
        
        if not candidate_users:
            if app.refresh_interval >= _CACHE_INTERVAL_:
                set_cache(_CACHE_, cache_key, _dict({
                    "data": [],
                    "expiry": add_to_date(now(), minutes=_CACHE_INTERVAL_, as_string=True, as_datetime=True)
                }))
            return {"users": []}
        
        user_types = [v.user_type for v in app.user_types] if app.user_types else ["System User"]
        
        data = frappe.get_all(
            "User",
            fields=["name", "full_name", "user_image"],
            filters={
                "enabled": 1,
                "name": ["in", candidate_users],
                "user_type": ["in", user_types],
            },
            order_by="full_name asc",
            limit_page_length=0,
        )
        
        if app.refresh_interval >= _CACHE_INTERVAL_:
            set_cache(_CACHE_, cache_key, _dict({
                "data": data,
                "expiry": add_to_date(
                    now(), minutes=_CACHE_INTERVAL_,
                    as_string=True, as_datetime=True
                )
            }))
        
        return {"users": data}
    
    except Exception as exc:
        log_error(exc)
        return {"error": 1, "message": _("Unable to get the list of active users.")}


def on_user_logout(login_manager=None):
    """Clear cached active users and delete lingering sessions on logout"""
    try:
        user = getattr(login_manager, "user", None) or frappe.session.user
        if user and user != "Guest":
            frappe.db.delete("Sessions", {"user": user})
            frappe.db.commit()
        del_cache(_CACHE_, "users")
    except Exception as exc:
        log_error(exc)
