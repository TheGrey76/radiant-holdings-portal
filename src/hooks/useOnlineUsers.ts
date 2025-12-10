import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OnlineUser {
  email: string;
  online_at: string;
}

export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const currentUserEmail = sessionStorage.getItem('abc_console_email') || '';

  useEffect(() => {
    if (!currentUserEmail) return;

    const channel = supabase.channel('abc-console-presence', {
      config: {
        presence: {
          key: currentUserEmail,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: OnlineUser[] = [];
        
        Object.keys(state).forEach((key) => {
          const presences = state[key] as any[];
          if (presences.length > 0) {
            users.push({
              email: key,
              online_at: presences[0].online_at || new Date().toISOString(),
            });
          }
        });
        
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            email: currentUserEmail,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserEmail]);

  const isUserOnline = (email: string) => {
    return onlineUsers.some((user) => user.email.toLowerCase() === email.toLowerCase());
  };

  return { onlineUsers, isUserOnline, currentUserEmail };
};
