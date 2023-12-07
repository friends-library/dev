import log from '@friends-library/slack';

async function main(): Promise<void> {
  try {
    const endpoint = process.env.INPUT_FLP_API_ENDPOINT ?? ``;
    const res = await fetch(`${endpoint}/pairql/evans-build/GetDocumentDownloadCounts`, {
      method: `POST`,
      headers: {
        Authorization: `Bearer ${process.env.INPUT_FLP_API_STATUS_QUERY_TOKEN}`,
      },
    });
    const json = await res.json();
    const count = validateOutput(json);
    await log.debug(`:white_check_mark: _FLP_ *Api Status Check* success \`${count}\``);
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

function validateOutput(output: unknown): number {
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
  if (typeof first !== `object` || first === null) {
    throw new Error(`Expected array of objects, got=${json}`);
  }
  const obj = first as Record<string, unknown>;
  if (!Object.hasOwn(obj, `downloadCount`)) {
    throw new Error(`Expected array of objects with \`downloadCount\` prop, got=${json}`);
  }
  const count = obj.downloadCount;
  if (typeof count !== `number`) {
    throw new Error(
      `Expected array of objects with \`downloadCount\` prop of type number, got=${json}`,
    );
  }
  return count;
}
