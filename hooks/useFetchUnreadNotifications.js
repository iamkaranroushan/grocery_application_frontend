import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchUnreadNotifications = (recipientId) => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;

    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUnreadNotifications = async () => {
        if (!recipientId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
            query Notification($recipientId: Int!) {
              notification(recipientId: $recipientId) {
                isRead
              }
            }
          `,
                    variables: { recipientId },
                },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true, }
            );

            if (response.data.errors) throw new Error(response.data.errors[0].message);

            const all = response.data.data.notification;
            const unread = all.filter((n) => !n.isRead);
            setUnreadCount(unread.length);
        } catch (err) {
            setError(err.message);
            console.error('Fetch notifications error:', err);
        } finally {
            setLoading(false);
        }
    };

    const markNotificationsAsRead = async () => {
        try {
            await axios.post(
                API_URL,
                {
                    query: `
                        mutation MarkAllNotificationsAsRead($recipientId: Int!) {
                        markAllNotificationsAsRead(recipientId: $recipientId){
                            message
                            success
                        }
                        }
                    `,
                    variables: { recipientId },
                },
                { headers: { 'Content-Type': 'application/json' } }
            );
            await fetchUnreadNotifications(); // refetch to update count
        } catch (err) {
            console.error("Failed to mark notifications as read:", err);
        }
    };

    useEffect(() => {
        fetchUnreadNotifications();
    }, [recipientId]);

    return { unreadCount, loading, error, refetch: fetchUnreadNotifications, markNotificationsAsRead };
};

export default useFetchUnreadNotifications;
