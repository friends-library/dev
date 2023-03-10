import { basename } from 'path';
import moment from 'moment';
import env from '@friends-library/env';

// @ts-ignore
import makeSend from 'gmail-send';

export default function send(paths: string[], email?: string): void {
  const { CLI_MAKE_CMD_GMAIL_USER, CLI_MAKE_CMD_GMAIL_PASS } = env.require(
    `CLI_MAKE_CMD_GMAIL_USER`,
    `CLI_MAKE_CMD_GMAIL_PASS`,
  );

  const sendEmail = makeSend({
    user: CLI_MAKE_CMD_GMAIL_USER,
    pass: CLI_MAKE_CMD_GMAIL_PASS,
  });

  const time = moment().format(`M/D/YY h:mm:ssa`);

  // @ts-ignore
  sendEmail(
    {
      subject: `[fl cli make] test docs @ ${time}`,
      html: `Attached files:<br /><ul>${paths
        .map((p) => `<li>${basename(p)}</li>`)
        .join(``)}</ul>`,
      to: email || CLI_MAKE_CMD_GMAIL_USER,
      files: paths,
    },
    // @ts-ignore
    (err) => {
      if (err) console.warn(err);
    },
  );
}
