import * as core from '@actions/core';
import { latestCommitSha } from '../helpers';
import * as pr from '../pull-requests';

async function main(): Promise<void> {
  const sha = latestCommitSha();
  if (!sha) {
    core.setFailed(`Unable to find latest commit sha`);
    return;
  }

  const shortSha = sha.substr(0, 8);
  const prData = await pr.data();
  const prNum: number | null = prData ? prData.number : (await pr.number()) || null;
  const prTitle: string | null = prData?.title ?? null;

  core.setOutput(`latest_commit_sha`, sha);
  core.setOutput(`latest_commit_sha_short`, shortSha);
  core.setOutput(`pull_request_number`, prNum ?? ``);
  core.setOutput(`pull_request_title`, prTitle ?? ``);

  core.info(`Output \`latest_commit_sha\` set to ${sha}`);
  core.info(`Output \`latest_commit_sha_short\` set to ${shortSha}`);
  core.info(`Output \`pull_request_number\` set to ${prNum ?? `(null)`}`);
  core.info(`Output \`pull_request_title\` set to ${prTitle ?? `(null)`}`);
}

main();
