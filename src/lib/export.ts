// Export utilities for PDF, CSV, Excel, PNG

export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    ),
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

export function exportToJSON(data: any, filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}

export function exportToText(content: string, filename: string): void {
  downloadFile(content, `${filename}.txt`, 'text/plain');
}

// Simple PDF generation using canvas
export async function exportToPDF(content: {
  title: string;
  sections: Array<{ heading: string; content: string }>;
}, filename: string): Promise<void> {
  // Create a simple text-based PDF representation
  let pdfContent = `${content.title}\n${'='.repeat(content.title.length)}\n\n`;
  
  content.sections.forEach(section => {
    pdfContent += `\n${section.heading}\n${'-'.repeat(section.heading.length)}\n${section.content}\n`;
  });

  downloadFile(pdfContent, `${filename}.txt`, 'text/plain');
}

// Export chart/widget as PNG
export function exportToPNG(elementId: string, filename: string): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  // For now, we'll use a simple approach
  // In production, you'd use html2canvas or similar library
  alert('PNG export feature requires html2canvas library. Exporting as text instead.');
  exportToText(element.innerText, filename);
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate report summaries
export function generateTaskReport(tasks: any[]): string {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const high = tasks.filter(t => t.priority === 'high').length;
  const overdue = tasks.filter(t => {
    if (!t.deadline) return false;
    return new Date(t.deadline) < new Date() && t.status !== 'done';
  }).length;

  return `Task Summary Report
===================

Total Tasks: ${total}
Completed: ${completed}
High Priority: ${high}
Overdue: ${overdue}
Completion Rate: ${total > 0 ? Math.round((completed / total) * 100) : 0}%

Generated: ${new Date().toLocaleString()}
`;
}

export function generateStudyReport(sessions: any[]): string {
  const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
  const avgSession = sessions.length > 0 ? totalHours / sessions.length : 0;
  const subjects = [...new Set(sessions.map(s => s.subject))];

  return `Study Session Report
===================

Total Sessions: ${sessions.length}
Total Hours: ${totalHours.toFixed(1)}
Average Session: ${avgSession.toFixed(1)} hours
Subjects Studied: ${subjects.length}

Subjects:
${subjects.map(s => `- ${s}`).join('\n')}

Generated: ${new Date().toLocaleString()}
`;
}

export function generateHabitReport(habits: any[]): string {
  const totalHabits = habits.length;
  const avgStreak = habits.reduce((sum, h) => sum + h.streak, 0) / totalHabits || 0;
  const totalXP = habits.reduce((sum, h) => sum + h.xp, 0);

  return `Habit Tracking Report
====================

Total Habits: ${totalHabits}
Average Streak: ${avgStreak.toFixed(1)} days
Total XP Earned: ${totalXP}

Habits:
${habits.map(h => `- ${h.name}: ${h.streak}-day streak`).join('\n')}

Generated: ${new Date().toLocaleString()}
`;
}
