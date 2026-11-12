export const remoteOrigins = {
  staging: 'https://miminiapp-staging.miminiapp-lab.workers.dev',
  production: 'https://miminiapp.miminiapp-lab.workers.dev',
} as const;

export type RemoteTarget = keyof typeof remoteOrigins;

/** Remote tests never choose a local server, default destination or arbitrary URL. */
export function resolveRemoteTarget(
  environment: NodeJS.ProcessEnv = process.env,
): { target: RemoteTarget; baseURL: string } {
  const target = environment.REMOTE_TARGET;
  if (target !== 'staging' && target !== 'production') {
    throw new Error('REMOTE_TARGET must explicitly be staging or production.');
  }
  const configuredURL = environment.REMOTE_BASE_URL;
  if (!configuredURL) {
    throw new Error(
      'REMOTE_BASE_URL must explicitly name the approved target.',
    );
  }
  let url: URL;
  try {
    url = new URL(configuredURL);
  } catch {
    throw new Error('REMOTE_BASE_URL must be a valid approved HTTPS origin.');
  }
  if (url.href !== `${remoteOrigins[target]}/`) {
    throw new Error(
      'REMOTE_BASE_URL does not match the approved target origin.',
    );
  }
  return { target, baseURL: url.href };
}

export function expectedReleaseIdentity(
  environment: NodeJS.ProcessEnv = process.env,
) {
  const sourceSha = environment.RELEASE_SOURCE_SHA;
  const sourceTree = environment.RELEASE_SOURCE_TREE;
  const payloadSha256 = environment.RELEASE_PAYLOAD_SHA256;
  if (
    !sourceSha ||
    !/^[a-f0-9]{40}$/.test(sourceSha) ||
    !sourceTree ||
    !/^[a-f0-9]{40}$/.test(sourceTree) ||
    !payloadSha256 ||
    !/^[a-f0-9]{64}$/.test(payloadSha256)
  ) {
    throw new Error(
      'Trusted RELEASE_SOURCE_SHA, RELEASE_SOURCE_TREE and RELEASE_PAYLOAD_SHA256 are required.',
    );
  }
  return {
    schemaVersion: 1,
    repository: 'aalexlpez/miminiapp',
    repositoryId: '1445849027',
    sourceSha,
    sourceTree,
    payloadSha256,
  };
}
