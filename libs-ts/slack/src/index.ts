import type { Environment } from '@friends-library/types';
import { send, sendJson } from './send';

interface LogFn {
  (msg: string, data?: Record<string, any>, emoji?: string): Promise<void>;
}

function log(msg: string, data?: Record<string, any>, channel?: string): Promise<void> {
  return sendAndLog({ msg, data, channel });
}

log.env = `production` as Environment;

log.setEnv = function (env: Environment): void {
  log.env = env;
};

const logError: LogFn = (msg, data, emoji) => {
  return sendAndLog({ msg, data, emoji: emoji ?? `:fire_engine:`, channel: `errors` });
};

const logInfo: LogFn = (msg, data, emoji) => {
  return sendAndLog({ msg, data, channel: `info`, emoji });
};

const logOrder: LogFn = (msg, data, emoji) => {
  return sendAndLog({ msg, data, channel: `orders`, emoji: emoji ?? `:books:` });
};

const logDownload: LogFn = (msg, data, emoji) => {
  return sendAndLog({ msg, data, channel: `downloads`, emoji });
};

const logAudio: LogFn = (msg, data, emoji) => {
  return sendAndLog({ msg, data, channel: `audio-downloads`, emoji });
};

const logDebug: LogFn = (msg, data, emoji) => {
  return sendAndLog({ msg, data, channel: `debug`, emoji });
};

log.error = logError;
log.info = logInfo;
log.order = logOrder;
log.download = logDownload;
log.audio = logAudio;
log.debug = logDebug;

interface SlackData {
  msg: string;
  data?: Record<string, any>;
  channel?: string;
  emoji?: string;
}

async function sendAndLog({
  msg,
  data,
  channel: prodChannel,
  emoji,
}: SlackData): Promise<void> {
  if (!shouldLog()) return;
  const logMethod: `error` | `log` = prodChannel === `errors` ? `error` : `log`;

  let channel = prodChannel || `debug`;
  if (log.env !== `production`) {
    channel = `staging`;
  }

  try {
    if (data) {
      await sendJson(msg, data, channel, emoji);
      // eslint-disable-next-line no-console
      console[logMethod](`#${channel}: ${msg}`, data);
      return;
    }

    send(msg, channel, emoji);
    // eslint-disable-next-line no-console
    console[logMethod](`#${channel}: ${msg}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error sending slack`, { error, msg, channel, emoji, data });
  }
}

function shouldLog(): boolean {
  if (typeof process.env.JEST_WORKER_ID !== `undefined`) {
    return false;
  }
  return process.env.NODE_ENV === undefined || process.env.NODE_ENV === `production`;
}

export default log;
