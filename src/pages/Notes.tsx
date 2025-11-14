import { useState, useEffect } from 'react';
import { Note } from '@/types';
import { storage, STORES } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Pin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const data = await storage.getAll<Note>(STORES.notes);
    setNotes(data.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Note title is required', variant: 'destructive' });
      return;
    }

    const noteData: Note = {
      id: editingNote?.id || crypto.randomUUID(),
      ...formData,
      isPinned: editingNote?.isPinned || false,
      createdAt: editingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingNote) {
      await storage.update(STORES.notes, noteData);
      toast({ title: 'Note updated!' });
    } else {
      await storage.add(STORES.notes, noteData);
      toast({ title: 'Note created!' });
    }

    resetForm();
    loadNotes();
  };

  const handleDelete = async (id: string) => {
    await storage.delete(STORES.notes, id);
    toast({ title: 'Note deleted!' });
    loadNotes();
  };

  const handlePin = async (note: Note) => {
    const updated = { ...note, isPinned: !note.isPinned };
    await storage.update(STORES.notes, updated);
    loadNotes();
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', category: '', tags: [] });
    setEditingNote(null);
    setIsDialogOpen(false);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notes</h1>
            <p className="text-muted-foreground">Your personal knowledge base</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Note
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <Card key={note.id} className="p-4 space-y-3 hover:shadow-lg transition-smooth">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold flex items-center gap-2">
                    {note.isPinned && <Pin className="w-4 h-4 text-primary" />}
                    {note.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handlePin(note)}>
                    <Pin className={`w-3 h-3 ${note.isPinned ? 'fill-current' : ''}`} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(note)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(note.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {note.content}
              </p>

              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  {note.category}
                </Badge>
                {note.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}

          {filteredNotes.length === 0 && (
            <Card className="col-span-full p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No notes found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term' : 'Create your first note to get started!'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Create Note
                </Button>
              )}
            </Card>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Edit Note' : 'Create Note'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Note title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                placeholder="Write your note here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
              />
              <Input
                placeholder="Category (e.g., School, Work, Ideas)"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              <Input
                placeholder="Tags (comma-separated)"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit">{editingNote ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
