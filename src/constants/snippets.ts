const describeByName = import.meta.glob('../snippets/**/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const contentByName = import.meta.glob('../snippets/**/*.hbs', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const descriptionById = Object.keys(describeByName).reduce((byKey, key) => {
  const next = { ...byKey };

  const [, path] = key.split('/snippets/');
  const [group, file] = path.split('/');
  const [name] = file.split('.');

  next[`${group}.${name}`] = JSON.parse(describeByName[key]);

  return next;
}, {} as Record<string, { title: string }>);

export const snippets = Object.keys(contentByName).reduce((byKey, key) => {
  const next = { ...byKey };

  const [, path] = key.split('/snippets/');
  const [group, file] = path.split('/');
  const [name, language] = file.split('.');

  const description = descriptionById[`${group}.${name}`]!;

  next[key] = { ...next[key], group, name, language, content: contentByName[key], ...description };

  return next;
}, {} as Record<string, { title: string; group: string; name: string; language: string; content: string }>);
