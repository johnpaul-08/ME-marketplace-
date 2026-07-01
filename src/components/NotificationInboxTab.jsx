import {  BellOff, Trash2, CheckCheck, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import '../styles/NotificationInbox.css';

/* ---- Relative time helper ---- */
function timeAgo(isoString) {
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const NotificationInboxTab = () => {
  const { notifications, unreadCount, markRead, markAllRead, deleteNotification, clearAll } =
    useNotifications();

  return (
    <div className="notif-inbox">
      {/* Header */}
      <div className="notif-inbox-header">
        <div className="notif-inbox-title">
          <h2>Notifications</h2>
          {unreadCount > 0 && (
            <span className="notif-inbox-badge">{unreadCount} new</span>
          )}
        </div>
        <div className="notif-inbox-actions">
          {unreadCount > 0 && (
            <button
              className="notif-action-btn"
              onClick={markAllRead}
              title="Mark all as read"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              className="notif-action-btn danger"
              onClick={clearAll}
              title="Clear all notifications"
            >
              <Trash2 size={16} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="notif-inbox-empty">
          <div className="notif-inbox-empty-icon">
            <BellOff size={40} strokeWidth={1.2} />
          </div>
          <h3>All caught up!</h3>
          <p>You have no notifications right now.</p>
        </div>
      ) : (
        <div className="notif-inbox-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-inbox-item${n.read ? '' : ' unread'}`}
              onClick={() => markRead(n.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && markRead(n.id)}
            >
              {/* Color accent bar */}
              <span
                className="notif-inbox-accent"
                style={{ background: n.color || 'var(--accent)' }}
              />

              {/* Icon / emoji bubble */}
              <div
                className="notif-inbox-icon"
                style={{
                  background: `${n.color || 'var(--accent)'}22`,
                  color: n.color || 'var(--accent)',
                }}
              >
                {n.emoji || '🔔'}
              </div>

              {/* Content */}
              <div className="notif-inbox-content">
                <div className="notif-inbox-top">
                  <strong className="notif-inbox-item-title">{n.title}</strong>
                  {!n.read && <span className="notif-inbox-unread-dot" />}
                </div>
                <p className="notif-inbox-message">{n.message}</p>
                <time className="notif-inbox-time">{timeAgo(n.time)}</time>
              </div>

              {/* Delete */}
              <button
                className="notif-inbox-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n.id);
                }}
                title="Remove"
                aria-label="Remove notification"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationInboxTab;
