import log from '@friends-library/slack';

async function main(): Promise<void> {
  try {
    const slug = await testFriendSlugOutput();
    const shipping = await testExploratoryMetadata();
    const data = JSON.stringify({ slug, shipping });
    await log.debug(`:white_check_mark: _FLP_ *Api Status Check* success \`${data}\``);
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

async function testExploratoryMetadata(): Promise<number> {
  const endpoint = process.env.INPUT_FLP_API_ENDPOINT ?? ``;
  const res = await fetch(`${endpoint}/pairql/order/GetPrintJobExploratoryMetadata`, {
    method: `POST`,
    headers: { 'Content-Type': `application/json` },
    body: JSON.stringify({
      items: [{ volumes: [167], printSize: `m`, quantity: 1 }],
      address: {
        name: `George Fox`,
        street: `777 Brockton Avenue`,
        city: `Abington`,
        state: `MA`,
        zip: `02351`,
        country: `US`,
        email: `george.fox@gmail.com`,
      },
      email: `george.fox@gmail.com`,
      lang: `en`,
    }),
  });
  const json = await res.json();
  return validatePrintJobOutput(json);
}

async function testFriendSlugOutput(): Promise<string> {
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
  return validateFriendSlugOutput(json);
}

main();

function validatePrintJobOutput(output: unknown): number {
  try {
    var json = JSON.stringify(output);
  } catch {
    throw new Error(`Got non-stringifiable JSON output: ${output}`);
  }
  if (output === null || typeof output !== `object` || Array.isArray(output)) {
    throw new Error(`Expected object output, got=${output}`);
  }
  const obj = output as Record<string, unknown>;
  if (obj.case !== `success`) {
    throw new Error(`Expected case="success", got=${json}`);
  }
  if (
    obj.metadata === null ||
    typeof obj.metadata !== `object` ||
    Array.isArray(obj.metadata)
  ) {
    throw new Error(`Expected metadata object, got=${json}`);
  }
  const metadata = obj.metadata as Record<string, unknown>;
  if (typeof metadata.shipping !== `number`) {
    throw new Error(`Expected metadata.shipping number, got=${json}`);
  }
  return metadata.shipping;
}

function validateFriendSlugOutput(output: unknown): string {
  try {
    var json = JSON.stringify(output);
  } catch {
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
