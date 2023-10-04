import { DeploymentProvider } from '../types';
import { Provider as ADO_Provider } from '@pulumi/azuredevops';

type InitConfig = {
//   deploymentProvider: DeploymentProvider;/
  projectName: string;
  uniqueName?: string;
};

export const initDeployments = (config: InitConfig) => {
  const personalAccessToken = process.env['AZDO_PERSONAL_ACCESS_TOKEN'];
  const orgServiceUrl = process.env['AZDO_ORG_SERVICE_URL'];

  const provider = new ADO_Provider(`name`, {
    personalAccessToken,
    orgServiceUrl,
  });
  console.log(provider)

  return { config, provider };
};
