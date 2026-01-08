import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface ScheduledPost {
  id: string;
  title: string;
  scheduled_for: string;
  status: string;
  angle: string;
}

interface FunnelContentCalendarProps {
  posts: ScheduledPost[];
  onSelectDate: (date: Date) => void;
  onSelectPost: (post: ScheduledPost) => void;
}

export function FunnelContentCalendar({ posts, onSelectDate, onSelectPost }: FunnelContentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPostsForDay = (day: Date) => {
    return posts.filter(post => 
      post.scheduled_for && isSameDay(new Date(post.scheduled_for), day)
    );
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const firstDayOfWeek = (monthStart.getDay() + 6) % 7; // Monday = 0

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-zinc-300 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Content Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-zinc-400 min-w-[120px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-zinc-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month start */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 bg-zinc-800/20 rounded" />
          ))}

          {/* Day cells */}
          {days.map(day => {
            const dayPosts = getPostsForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`h-20 p-1 rounded border cursor-pointer transition-colors ${
                  isToday 
                    ? "bg-zinc-800 border-amber-800/50" 
                    : "bg-zinc-800/30 border-zinc-800 hover:border-zinc-700"
                }`}
                onClick={() => onSelectDate(day)}
              >
                <div className={`text-xs mb-1 ${isToday ? "text-amber-400 font-medium" : "text-zinc-500"}`}>
                  {format(day, "d")}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  {dayPosts.slice(0, 2).map(post => (
                    <div
                      key={post.id}
                      className="text-xs truncate px-1 py-0.5 rounded bg-zinc-700/50 text-zinc-300 cursor-pointer hover:bg-zinc-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPost(post);
                      }}
                      title={post.title}
                    >
                      {post.title}
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <div className="text-xs text-zinc-500 px-1">
                      +{dayPosts.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming posts list */}
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <h4 className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Upcoming Scheduled</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {posts
              .filter(p => p.scheduled_for && new Date(p.scheduled_for) >= new Date())
              .sort((a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime())
              .slice(0, 5)
              .map(post => (
                <div 
                  key={post.id} 
                  className="flex items-center justify-between p-2 bg-zinc-800/30 rounded text-sm cursor-pointer hover:bg-zinc-800/50"
                  onClick={() => onSelectPost(post)}
                >
                  <span className="text-zinc-300 truncate flex-1">{post.title}</span>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-500">
                      {post.angle}
                    </Badge>
                    <span className="text-xs text-zinc-500">
                      {format(new Date(post.scheduled_for), "MMM d")}
                    </span>
                  </div>
                </div>
              ))}
            {posts.filter(p => p.scheduled_for && new Date(p.scheduled_for) >= new Date()).length === 0 && (
              <p className="text-xs text-zinc-600 text-center py-2">No scheduled posts</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
