import { Subject, Resource, Note, Task, FlashcardDeck, SelfQuiz, StudentProfile, StudyActivityLog, VideoResource, Folder } from '../types';

export interface StudyNestBackup {
  version: string;
  exportedAt: string;
  profile: StudentProfile;
  subjects: Subject[];
  folders?: Folder[];
  resources: Resource[];
  videos?: VideoResource[];
  notes: Note[];
  tasks: Task[];
  decks: FlashcardDeck[];
  quizzes: SelfQuiz[];
  activities: StudyActivityLog[];
}

export function exportStudyNestData(data: Omit<StudyNestBackup, 'version' | 'exportedAt'>) {
  const backup: StudyNestBackup = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    ...data,
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `studynest-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function parseBackupFile(file: File): Promise<StudyNestBackup> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as StudyNestBackup;
        if (!parsed.subjects || !parsed.notes || !parsed.tasks) {
          throw new Error('Invalid backup structure: Missing essential subjects, notes, or tasks collections.');
        }
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Failed to parse backup JSON: ${(err as Error).message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsText(file);
  });
}
