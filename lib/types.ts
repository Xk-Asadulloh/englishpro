export type Level = "Beginner" | "Intermediate" | "Advanced";
export type Lesson = {
  id: string;
  title: string;
  level: Level;
  description: string;
  videoUrl: string;
  duration: string;
  publishedAt: string;
};

export const starterLessons: Lesson[] = [
  {
    id: "lesson-1",
    title: "Ingliz tilida tanishish va salomlashish",
    level: "Beginner",
    description: "Salomlashish, o'zingizni tanishtirish va oddiy savollar berishni o'rganing.",
    videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    duration: "12:30",
    publishedAt: "2026-10-01"
  },
  {
    id: "lesson-2",
    title: "To be: am, is, are",
    level: "Beginner",
    description: "Am, is, are yordamida sodda va to'g'ri gaplar tuzishni mashq qiling.",
    videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    duration: "18:45",
    publishedAt: "2026-10-04"
  },
  {
    id: "lesson-3",
    title: "Present Simple",
    level: "Intermediate",
    description: "Kundalik odatlar, takrorlanadigan ishlar va savol shakllari.",
    videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    duration: "21:10",
    publishedAt: "2026-10-08"
  }
];

export const levelLabel: Record<Level, string> = {
  Beginner: "Boshlang'ich",
  Intermediate: "O'rta",
  Advanced: "Yuqori"
};
