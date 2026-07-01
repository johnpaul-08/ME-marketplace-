import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabase';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const userIdRef = useRef(null); // always in sync, no stale closure

  /* ── 1. Track auth user ─────────────────────────────── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      userIdRef.current = uid;
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      userIdRef.current = uid;
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── 2. Fetch + Realtime when userId changes ─────────── */
  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    // Fetch existing
    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .schema('marketplace_dataspace')
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Notif] Fetch error:', error.message);
      } else if (data) {
        setNotifications(data.map(n => ({ ...n, time: n.created_at })));
      }
      setLoading(false);
    };

    fetchNotifications();

    // Realtime: auto-add new rows from other sessions/devices
    const channel = supabase
      .channel(`notif_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'marketplace_dataspace',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const n = payload.new;
          setNotifications((prev) => {
            if (prev.find(x => x.id === n.id)) return prev; // dedup
            return [{ ...n, time: n.created_at }, ...prev];
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ── Actions ─────────────────────────────────────────── */

  /**
   * addNotification — updates UI immediately (optimistic),
   * then persists to Supabase in the background.
   * Accepts optional userId override so callers can pass it directly.
   */
  const addNotification = useCallback((notif, overrideUserId) => {
    // Build a temporary local item so the bell badge updates INSTANTLY
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const tempItem = {
      id:         tempId,
      user_id:    overrideUserId || userIdRef.current || null,
      type:       notif.type    || 'order',
      title:      notif.title,
      message:    notif.message,
      color:      notif.color  || null,
      read:       false,
      created_at: new Date().toISOString(),
      time:       new Date().toISOString(),
      _temp:      true, // marker to replace once DB confirms
    };

    // --- Immediate local state update (bell badge & inbox update NOW) ---
    setNotifications((prev) => [tempItem, ...prev]);

    // --- Save to Supabase in background ---
    const uid = overrideUserId || userIdRef.current;
    if (!uid) {
      console.warn('[Notif] No userId — saved locally only.');
      return;
    }

    supabase
      .schema('marketplace_dataspace')
      .from('notifications')
      .insert({
        user_id: uid,
        type:    notif.type    || 'order',
        title:   notif.title,
        message: notif.message,
        color:   notif.color  || null,
        read:    false,
      })
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('[Notif] Supabase insert failed:', error.code, error.message);
          // Remove temp item on failure so UI stays consistent
          setNotifications((prev) => prev.filter(n => n.id !== tempId));
          return;
        }
        // Replace temp item with real DB row (has real UUID)
        if (data) {
          setNotifications((prev) =>
            prev.map(n =>
              n.id === tempId ? { ...data, time: data.created_at } : n
            )
          );
        }
      });
  }, []);

  /** Mark a single notification as read */
  const markRead = useCallback(async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    const { error } = await supabase
      .schema('marketplace_dataspace')
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    if (error) console.error('[Notif] markRead error:', error.message);
  }, []);

  /** Mark all notifications as read */
  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    const uid = userIdRef.current;
    if (!uid) return;
    const { error } = await supabase
      .schema('marketplace_dataspace')
      .from('notifications')
      .update({ read: true })
      .eq('user_id', uid)
      .eq('read', false);
    if (error) console.error('[Notif] markAllRead error:', error.message);
  }, []);

  /** Delete a single notification */
  const deleteNotification = useCallback(async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const { error } = await supabase
      .schema('marketplace_dataspace')
      .from('notifications')
      .delete()
      .eq('id', id);
    if (error) console.error('[Notif] deleteNotification error:', error.message);
  }, []);

  /** Clear all notifications for this user */
  const clearAll = useCallback(async () => {
    setNotifications([]);
    const uid = userIdRef.current;
    if (!uid) return;
    const { error } = await supabase
      .schema('marketplace_dataspace')
      .from('notifications')
      .delete()
      .eq('user_id', uid);
    if (error) console.error('[Notif] clearAll error:', error.message);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        addNotification,
        markRead,
        markAllRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
};
