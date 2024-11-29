import type { Tree } from '@nx/devkit';
import { formatFiles, generateFiles, names } from '@nx/devkit';
import * as path from 'path';
import * as os from 'os';

import type { CreateActionGeneratorSchema } from './schema';

type NormalizedNames = {
  name: string;
  className: string;
  propertyName: string;
  constantName: string;
  fileName: string;
};

const createExportStatementForTheUseCase = (name: NormalizedNames): string => {
  return `export * as ${name.className} from './${name.fileName}'`;
};

const createUseCaseErrorMessage = (useCase: string, eol: string): string => {
  return `${eol}Provided use case name "${useCase}" does not comply with the rule of ending with 'ing' suffix. Please provide other name.${eol}`;
};

const createSourceErrorMessage = (source: string, eol: string): string => {
  return `${eol}Source of Actions ${source} already exists!${eol}`;
};

export const createActionGenerator = async (tree: Tree, options: CreateActionGeneratorSchema): Promise<void> => {
  const nameWithoutSuffix = options.name.replace(/Component$/, '');
  const normalizedSourceName = names(nameWithoutSuffix);
  const normalizedUseCase = names(options.useCase);
  const projectRoot = `apps/calculator/src/app/modules/core/state/actions/${normalizedSourceName.fileName}`;
  const useCaseProjectRoot = `${projectRoot}/${normalizedUseCase.fileName}`;
  const eol = os.EOL;

  if (tree.exists(projectRoot)) {
    console.error(createSourceErrorMessage(projectRoot, eol));
  } else {
    generateFiles(tree, path.join(__dirname, 'files-for-source'), projectRoot, {
      ...options,
      name: normalizedSourceName.fileName,
      className: normalizedSourceName.className,
    });

    await formatFiles(tree);
  }

  if (tree.exists(useCaseProjectRoot)) {
    console.error(`${eol}UseCase file ${useCaseProjectRoot} already exists!${eol}`);
  } else {
    if (options.useCase.indexOf('ing') < 0) {
      console.error(createUseCaseErrorMessage(options.useCase, eol));
      return;
    }

    generateFiles(tree, path.join(__dirname, 'files-for-use-case'), useCaseProjectRoot, {
      ...options,
      sourceClassName: normalizedSourceName.className,
      useCaseClassName: normalizedUseCase.className,
      useCaseFileName: normalizedUseCase.fileName,
    });

    await formatFiles(tree);

    const filePath = `${projectRoot}/${normalizedSourceName.fileName}.ts`;
    const contents = tree.read(filePath).toString();
    const exportStatementForTheNewUseCase = createExportStatementForTheUseCase(normalizedUseCase);

    let updatedContents;

    if (contents.endsWith(eol)) {
      updatedContents = `${contents}${exportStatementForTheNewUseCase}`;
    } else {
      updatedContents = `${contents}${eol}${exportStatementForTheNewUseCase}`;
    }

    tree.write(filePath, updatedContents);
    await formatFiles(tree);
  }
};

export default createActionGenerator;
