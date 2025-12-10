import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

export const OnlineUsersIndicator = () => {
  const { onlineUsers, currentUserEmail } = useOnlineUsers();

  const formatName = (email: string) => {
    const name = email.split('@')[0];
    return name
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{onlineUsers.length}</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Team Online</h4>
            <Badge variant="secondary" className="text-xs">
              {onlineUsers.length} online
            </Badge>
          </div>
          <div className="space-y-2">
            {onlineUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun utente online</p>
            ) : (
              onlineUsers.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center gap-2 p-2 rounded-md bg-secondary/30"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {formatName(user.email)}
                      {user.email.toLowerCase() === currentUserEmail.toLowerCase() && (
                        <span className="text-muted-foreground ml-1">(tu)</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
