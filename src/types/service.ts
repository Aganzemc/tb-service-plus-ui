export type Service = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number | null;
  created_at: string;
};
