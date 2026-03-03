export interface Post {
  id: number;
  slug: string;
  title: string;
  date: string;
  image: string | null;
  content: string[];
}
