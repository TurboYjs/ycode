export enum CodeType {
  cpp = 'cpp',
  nodejs = 'nodejs',
  typescript = 'typescript',
  go = 'go',
  python3 = 'python3',
  java = 'java',
  php = 'php',
  rust = 'rust',
  c = 'c',
  dotnet = 'dotnet',
}

export enum CodeEnv {
  cpp = 'cpp:runcode',
  nodejs = 'nodejs:runcode',
  typescript = 'nodejs:runcode',
  go = 'go:runcode',
  python3 = 'python3:runcode',
  java = 'java:runcode',
  php = 'php:runcode',
  rust = 'rust:runcode',
  c = 'cpp:runcode',
  dotnet = 'dotnet:runcode',
}

export enum FileSuffix {
  cpp = 'cpp',
  nodejs = 'js',
  typescript = 'ts',
  go = 'go',
  python3 = 'py',
  java = 'java',
  php = 'php',
  rust = 'rs',
  c = 'c',
  dotnet = 'cs',
}

export enum Channel {
  self = 0,
  juejin,
  v2ex,
  'tools.fun',
  github,
  google,
  baidu,
  bing,
}

export const ChannelText = {
  [Channel.self]: '自然流量',
  [Channel.juejin]: '掘金',
  [Channel.v2ex]: 'v2ex',
  [Channel['tools.fun']]: 'tools.fun',
  [Channel.github]: 'Github',
  [Channel.google]: 'Google',
  [Channel.baidu]: 'Baidu',
  [Channel.bing]: 'bing',
};
