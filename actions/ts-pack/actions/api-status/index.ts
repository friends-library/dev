import log from '@friends-library/slack';

async function main(): Promise<void> {
  try {
    const endpoint = process.env.INPUT_FLP_API_ENDPOINT ?? ``;
    const res = await fetch(`${endpoint}/pairql/evans-build/PublishedFriendSlugs`, {
      method: `POST`,
      headers: {
        Authorization: `Bearer ${process.env.INPUT_FLP_API_STATUS_QUERY_TOKEN}`,
        'Content-Type': `application/json`,
      },
      body: JSON.stringify({ lang: `en` }),
    });
    const json = await res.json();
    const slug = validateOutput(json);
    await log.debug(`:white_check_mark: _FLP_ *Api Status Check* success \`${slug}\``);
  } catch (error: unknown) {
    await log.error(`_FLP_ *Api Status Check* failed`, { error: String(error) });
  }

  try {
    const endpoint = process.env.INPUT_GERTRUDE_API_ENDPOINT ?? ``;
    const res = await fetch(`${endpoint}/releases`);
    const json = await res.json();
    const data = JSON.stringify(json[0].version);
    await log.debug(
      `:white_check_mark: _Gertrude_ *Api Status Check* success \`${data}\``,
    );
  } catch (error: unknown) {
    await log.error(`_Gertrude_ *Api Status Check* failed`, { error: String(error) });
  }
}

main();

function validateOutput(output: unknown): string {
  try {
    var json = JSON.stringify(output);
  } catch (error) {
    throw new Error(`Got non-stringifiable JSON output: ${output}`);
  }
  if (!Array.isArray(output)) {
    throw new Error(`Expected array output, got=${json}`);
  }
  if (output.length === 0) {
    throw new Error(`Expected non-empty array output, got=${json}`);
  }
  const first = output[0];
  if (typeof first !== `string`) {
    throw new Error(`Expected array of strings, got=${json}`);
  }
  return first;
}
