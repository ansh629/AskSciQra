export interface Source {
  title: string;
  url: string;
}

export interface Message {
  id: string;
  type: 'user' | 'ai' | 'error' | 'loading';
  text: string;
  sources?: Source[];
  rawAnswer?: string; // Storing the raw answer for copy functionality
}
