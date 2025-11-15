import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const NotesWidget = () => {
  const [note, setNote] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('quickNote');
    const savedTime = localStorage.getItem('quickNoteTime');
    if (saved) setNote(saved);
    if (savedTime) setLastSaved(new Date(savedTime));
  }, []);

  useEffect(() => {
    if (note) {
      const timer = setTimeout(() => {
        localStorage.setItem('quickNote', note);
        const now = new Date();
        localStorage.setItem('quickNoteTime', now.toISOString());
        setLastSaved(now);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [note]);

  const clearNote = () => {
    setNote("");
    localStorage.removeItem('quickNote');
    localStorage.removeItem('quickNoteTime');
    setLastSaved(null);
    toast({
      title: "Note cleared",
      description: "Your quick note has been removed",
    });
  };

  return (
    <Card className="gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Quick Notes
          </div>
          {note && (
            <Button variant="ghost" size="sm" onClick={clearNote}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Jot down quick thoughts..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={6}
          className="resize-none"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{note.length}/500 characters</span>
          {lastSaved && (
            <span>Saved {lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
