import '@friends-library/env/load';
import * as fs from 'fs';
import { resolve } from 'path';
import exec from 'x-exec';
import fetch from 'cross-fetch';
import env from '@friends-library/env';
import { getClient, gql, writable } from '@friends-library/db';
import { PrintSize } from '@friends-library/types';
import { FriendData } from '../types';
import { GetFriends } from '../graphql/GetFriends';

const ROOT = env.requireVar(`DOCS_REPOS_ROOT`);

async function main(): Promise<void> {
  const friends: FriendData[] = [];

  if (!process.env.CI) {
    var client = getClient({ env: `infer_node`, process, fetch });
    const { data } = await client.query<GetFriends>({ query: QUERY });
    const sortedFriends = writable(data.friends).sort((a, b) =>
      a.alphabeticalName < b.alphabeticalName ? -1 : 1,
    );
    for (const friend of sortedFriends) {
      friends.push({
        name: friend.name,
        alphabeticalName: friend.alphabeticalName,
        description: friend.description,
        documents: friend.documents.map((doc) => ({
          lang: friend.lang,
          title: doc.title,
          description: doc.description,
          isCompilation: friend.isCompilations,
          editions: doc.editions.map((ed) => ({
            id: ed.id,
            path: ed.path,
            type: ed.type,
            pages: ed.impression?.paperbackVolumes[0] ?? 222,
            size: (ed.impression?.paperbackSize ?? `m`) as PrintSize,
            isbn: ed.isbn?.code ?? ``,
          })),
          ...getCustomCode(doc.directoryPath),
        })),
      });
    }
  }

  const destPath = resolve(__dirname, `../friends.js`);
  fs.writeFileSync(destPath, `window.Friends = ${JSON.stringify(friends)}`);
  exec(`prettier --write ${destPath}`);
}

function getCustomCode(path: string): {
  customHtml: string | null;
  customCss: string | null;
} {
  const fullPath = `${ROOT}/${path}`;
  let customCss: string | null = null;
  let customHtml: string | null = null;

  if (fs.existsSync(`${fullPath}/paperback-cover.css`)) {
    customCss = fs.readFileSync(`${fullPath}/paperback-cover.css`, `utf8`);
  }

  if (fs.existsSync(`${fullPath}/paperback-cover.html`)) {
    customHtml = fs.readFileSync(`${fullPath}/paperback-cover.html`, `utf8`);
  }
  return { customCss, customHtml };
}

const QUERY = gql`
  query GetFriends {
    friends: getFriends {
      name
      alphabeticalName
      lang
      description
      isCompilations
      documents {
        title
        description
        directoryPath
        editions {
          id
          path: directoryPath
          type
          isbn {
            code
          }
          impression {
            paperbackVolumes
            paperbackSize
          }
        }
      }
    }
  }
`;

main();
