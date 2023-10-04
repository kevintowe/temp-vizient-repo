import { Provider } from '@pulumi/pulumi/provider';
import { DeploymentProvider } from '../types';
import { Provider as ADO_Provider } from '@pulumi/azuredevops';
import { ComponentResource } from '@pulumi/pulumi';

type InitConfig = {
  deploymentProvider: DeploymentProvider;
  projectName: string;
  uniqueName?: string;
};

// export const initDeployments = (config: InitConfig) => {
// 	const personalAccessToken = process.env['AZDO_PERSONAL_ACCESS_TOKEN'];
//   const orgServiceUrl = process.env['AZDO_ORG_SERVICE_URL'];

//   const provider = new ADO_Provider(`name`, { personalAccessToken, orgServiceUrl });
  
//   return { config, provider };
// };

class MyComponent extends ComponentResource {
	// public readonly bucket: aws.s3.Bucket | undefined;

	constructor(name: string, args: aws.s3.BucketArgs, opts?: pulumi.ComponentResourceOptions) {
			super("Vizientinc:DevOps:Deployments", name, {}, opts);

			try {
					this.bucket = new aws.s3.Bucket(`${name}-bucket`, args, { parent: this });
			} catch (error) {
					console.error(`Failed to create the Deployment Init resource.: ${error}`);
					throw error;
			}
	}

export const initDeployments = () => {

}