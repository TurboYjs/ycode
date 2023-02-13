export const languages: any = {
  plaintext: 'Plaintext',
  'text/x-c++src': 'C++',
  'text/x-java': 'Java',
  'text/x-csrc': 'C',
  'text/x-csharp': 'C#',
  'text/x-go': 'Golang',
  'application/xml': 'HTML',
  'text/javascript': 'Javascript',
  'application/x-httpd-php': 'PHP',
  'text/x-python': 'Python',
  'text/x-rsrc': 'R',
  'text/x-ruby': 'Ruby',
  'text/x-rustsrc': 'Rust',
  'text/x-scala': 'Scala',
  'text/x-swift': 'Swift',
};

export const language = new Map();
// eslint-disable-next-line dot-notation
language.set('plaintext', ['Plaintext']);
language.set('text/x-c++src', ['C++', 'cpp17', 0]);
language.set('text/x-java', ['Java', 'java', 3]) ;
language.set('text/x-csrc', ['C', 'c99', 3]);
language.set('application/x-httpd-php', ['PHP', 'php', 3]);
language.set('text/x-python',['Python', 'python3', 3]);
language.set('text/x-ruby', ['Ruby', 'ruby', 3]);
language.set('text/x-go', ['Golang', 'go', 3]);
language.set('text/x-scala',['Scala', 'scala', 3]);
language.set('text/x-csharp', ['C#', 'csharp', 3]);
language.set('text/x-swift',['Swift', 'swift', 3]);
language.set('text/x-rustsrc', ['Rust', 'rust', 3]);
language.set('text/x-rsrc', ['R', 'r', 3]);
language.set('text/javascript',['Javascript', 'nodejs', 3]);