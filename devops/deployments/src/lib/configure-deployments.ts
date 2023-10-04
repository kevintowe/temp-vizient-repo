import {
  Provider as ADO_Provider,
  Git,
  getProjectOutput,
  GitRepositoryFile,
  BuildDefinition,
} from '@pulumi/azuredevops';
import { buildFunctionAppDeploymentPipeline } from './function-app';

export interface FnAppConfig {
  storageAccountName: string;
  functionAppName: string;
}
export interface StaticSiteConfig {
  storageAccountName: string;
  staticSiteName: string;
}
export interface AppServiceConfig {
  appServiceName: string;
}

export type InitConfig = {
  //   deploymentProvider: DeploymentProvider;/
  projectName: string;
  uniqueName?: string;
  fnApps: FnAppConfig[];
  staticSites: StaticSiteConfig[];
  appServices: AppServiceConfig[];
  generateOneDeployToRuleThemAll: boolean;
};

export const configureDeployments = (config: InitConfig) => {
  const personalAccessToken = process.env['AZDO_PERSONAL_ACCESS_TOKEN'];
  const orgServiceUrl = process.env['AZDO_ORG_SERVICE_URL'];

  const provider = new ADO_Provider(`ADO_Provider`, {
    personalAccessToken,
    orgServiceUrl,
  });

  const adoProject = getProjectOutput(
    { name: config.projectName },
    { provider }
  );

  const deploymentsRepo = new Git(
    `${config.projectName}_deployments`,
    {
      initialization: {
        initType: 'Import',
        sourceUrl: 'https://github.com/kevintowe/emptyRepo',
        sourceType: 'Git',
      },
      //   defaultBranch: 'ref/head/main',
      projectId: adoProject.id,
      name: `${config.projectName}__deployments`,
    },
    { provider }
  );

  // TODO: consider setting a branch/repo policy to prevent manual edits to the generated pipeline files.

  // Build Function App Pipelines
  config.fnApps.forEach((f) => {
    const pipelineFilePath = `function-apps/${f.functionAppName}-deployment.pipeline.yaml`;
    // generate yaml file
    const repoFile = new GitRepositoryFile(
      `${f.functionAppName}_deployment_file`,
      {
        repositoryId: deploymentsRepo.id,
        file: pipelineFilePath,
        content: buildFunctionAppDeploymentPipeline(config, f),
        branch: 'refs/heads/main',
        commitMessage: `Generating deployment pipeline for ${f.functionAppName}.`,
        overwriteOnCreate: true,
      }
    );
    // generate pipeline
    const buildDefinition = new BuildDefinition(
      `${f.functionAppName}_deployment_file`,
      {
        projectId: adoProject.id,
        repository: {
          repoId: deploymentsRepo.id,
          repoType: 'TfsGit',
          ymlPath: pipelineFilePath,
        },
      }
    );
  });
};
