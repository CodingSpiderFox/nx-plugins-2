import * as path from 'path';
import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';

import { DeployExecutorSchema } from './schema';
import { createCommand, runCommandProcess, parseArgs } from '../../utils/executor.util';
import { ParsedExecutorInterface } from '../../interfaces/parsed-executor.interface';

export interface ParsedDeployExecutorOption extends ParsedExecutorInterface {
  parseArgs?: Record<string, string>;
  stacks?: string[];
  app?: string;
  sourceRoot: string;
  root: string;
}

export default async function runExecutor(options: DeployExecutorSchema, context: ExecutorContext) {
  const normalizedOptions = normalizeOptions(options, context);
  const result = await runDeploy(normalizedOptions, context);

  return {
    success: result,
  };
}

async function runDeploy(options: ParsedDeployExecutorOption, context: ExecutorContext) {
  const command = createCommand('deploy', options);
  return runCommandProcess(command, path.join(context.root, options.root));
}

function normalizeOptions(options: DeployExecutorSchema, context: ExecutorContext): ParsedDeployExecutorOption {
  const parsedArgs = parseArgs(options);
  let stacks;

  if (Object.prototype.hasOwnProperty.call(parsedArgs, 'stacks')) {
    stacks = parsedArgs.stacks;
  }
  const { sourceRoot, root } = context?.workspace?.projects[context.projectName];

  return {
    ...options,
    parseArgs: parsedArgs,
    stacks,
    sourceRoot,
    root,
  };
}
