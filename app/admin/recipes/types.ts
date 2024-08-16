export type Recipe = {
    id: string;
    name: string;
    category: string;
    ingredients: Array<{ name: string; amount: string }>;
    instructions: string;
    image: string | null;
  };