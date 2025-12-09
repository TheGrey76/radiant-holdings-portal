import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";

// Team members based on authorized console users
const TEAM_MEMBERS = [
  { email: "edoardo.grigione@aries76.com", name: "Edoardo Grigione" },
  { email: "alessandro.catullo@aries76.com", name: "Alessandro Catullo" },
  { email: "stefano.taioli@abccompany.it", name: "Stefano Taioli" },
  { email: "enrico.sobacchi@abccompany.it", name: "Enrico Sobacchi" },
  { email: "lorenzo.delforno@abccompany.it", name: "Lorenzo Del Forno" },
];

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onMentions?: (emails: string[]) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const MentionInput = ({
  value,
  onChange,
  onMentions,
  placeholder = "Scrivi un messaggio... usa @nome per menzionare",
  className = "",
  autoFocus = false,
}: MentionInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof TEAM_MEMBERS>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extract @mentions from text
  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+(?:\s+\w+)?)/g;
    const mentions: string[] = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionName = match[1].toLowerCase();
      const member = TEAM_MEMBERS.find(m => 
        m.name.toLowerCase().includes(mentionName) ||
        m.name.toLowerCase().replace(/\s+/g, '').includes(mentionName.replace(/\s+/g, ''))
      );
      if (member) {
        mentions.push(member.email);
      }
    }
    return [...new Set(mentions)];
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursor = e.target.selectionStart;
    setCursorPosition(cursor);
    onChange(newValue);

    // Check if we're typing a mention
    const textBeforeCursor = newValue.slice(0, cursor);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);

    if (atMatch) {
      const query = atMatch[1].toLowerCase();
      const filtered = TEAM_MEMBERS.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query)
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(0);
    } else {
      setShowSuggestions(false);
    }

    // Update mentions callback
    if (onMentions) {
      onMentions(extractMentions(newValue));
    }
  };

  const insertMention = (member: typeof TEAM_MEMBERS[0]) => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    const newText = textBeforeCursor.slice(0, atIndex) + 
      `@${member.name.split(' ')[0]}` + 
      textAfterCursor;
    
    onChange(newText);
    setShowSuggestions(false);

    if (onMentions) {
      onMentions(extractMentions(newText));
    }

    // Refocus textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && showSuggestions) {
      e.preventDefault();
      if (suggestions[selectedIndex]) {
        insertMention(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        autoFocus={autoFocus}
      />
      
      {showSuggestions && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-popover border border-border rounded-md shadow-lg">
          {suggestions.map((member, index) => (
            <button
              key={member.email}
              type="button"
              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                index === selectedIndex 
                  ? 'bg-accent text-accent-foreground' 
                  : 'hover:bg-muted'
              }`}
              onClick={() => insertMention(member)}
            >
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="font-medium">{member.name}</div>
                <div className="text-xs text-muted-foreground">{member.email}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { TEAM_MEMBERS };
