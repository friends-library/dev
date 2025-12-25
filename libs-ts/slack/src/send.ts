import env from '@friends-library/env';
import { WebClient } from '@slack/client';

export async function send(
  msg: string,
  channel: string,
  emoji = `:robot_face:`,
): Promise<void> {
  getClient(channel).chat.postMessage({
    username: `FL Bot`,
    icon_emoji: emoji,
    parse: `full`,
    channel,
    text: msg,
    blocks: [sectionBlock(msg)],
  });
}

export async function sendJson(
  msg: string,
  data: Record<string, Record<string, any>>,
  channel: string,
  emoji = `:robot_face:`,
): Promise<void> {
  const blocks = [sectionBlock(msg)];
  for (const label in data) {
    blocks.push(sectionBlock(`_${label.toUpperCase()}:_`));
    const json = JSON.stringify(data[label], null, 2).slice(0, MAX_BLOCK_LEN);
    blocks.push(sectionBlock(`\`\`\`` + json + `\`\`\``));
  }
  getClient(channel).chat.postMessage({
    username: `FL Bot`,
    icon_emoji: emoji,
    parse: `full`,
    channel,
    text: msg,
    blocks,
  });
}

let clientMain: WebClient | undefined;
let clientBot: WebClient | undefined;

function getClient(channel: string): WebClient {
  const workspace = [`debug`, `audio-downloads`].includes(channel) ? `BOT` : `MAIN`;
  if (workspace === `MAIN`) {
    if (!clientMain) {
      clientMain = workspaceClient(`MAIN`);
    }
    return clientMain;
  }
  if (!clientBot) {
    clientBot = workspaceClient(`BOT`);
  }
  return clientBot;
}

function workspaceClient(workspace: `BOT` | `MAIN`): WebClient {
  const varname = `SLACK_API_TOKEN_WORKSPACE_${workspace}`;
  const token = env.require(varname)[varname];
  return new WebClient(token);
}

interface SectionBlock {
  type: `section`;
  text: {
    type: `mrkdwn`;
    text: string;
  };
}

function sectionBlock(text: string): SectionBlock {
  return {
    type: `section`,
    text: {
      type: `mrkdwn`,
      text,
    },
  };
}

// actual value seems to be 3001, leave a little fudge room
const MAX_BLOCK_LEN = 2900;
