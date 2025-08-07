export interface Chemical {
  id: string;
  name: string;
  description: string;
  formula: string;
  imageUrl: string;
}

export interface Synchronicity {
  id: string;
  title: string;
  story: string;
  submitter?: string;
}
