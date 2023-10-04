import { InitConfig, StaticSiteConfig } from './configure-deployments';

const buildResources = () => {
  return ``;
};

const buildMatrix = () => {
  return `strategy:
matrix:
  dev:
    env: 'dev'
  test:
    env: 'test'
  stage:
    env: 'stage
  prod:
    env: 'prod'`;
};

const buildParameters = () => {
  return ``;
};

const buildDeployJob = (config) => {
  return `- deployment: ${env}_${staticSiteConfig.staticSiteName}_Deployment
  displayName: ${env} Deployment
  pool:
    vmImage: ubuntu-latest
  environment: ${env}
  strategy:
    runOnce:
      deploy:
        steps: 
          # - task: DownloadPipelineArtifact@2
          #   inputs:
          #     source: 'specific'
          #     project: 'DataExchangePlatform'
          #     pipeline: 'DataExchangePlatform-ui'
          #     runVersion: 'latest'
          #     artifact: '$(System.TeamProject)-${appName}'
          #     path: '$(Build.ArtifactStagingDirectory)'
          - task: DownloadBuildArtifacts@1
            displayName: 'Download Artifact'
            inputs:
              buildType: 'specific'
              project: 'DataExchangePlatform'
              pipeline: '${appName}'
              buildVersionToDownload: latest
              downloadType: 'single'
              artifactName: '${appName}'
              itemPattern: '${appName}/**'
              downloadPath: '$(Build.ArtifactStagingDirectory)'
          - task: replacetokens@5
            displayName: "Replacing Variable Tokens"
            inputs:
                targetFiles: '$(Build.ArtifactStagingDirectory)/${appName}/*.js'
                encoding: 'auto'
                tokenPattern: 'default'
                writeBOM: true
                actionOnMissing: 'warn'
                keepToken: false
                actionOnNoFiles: 'continue'
                enableTransforms: false
                enableRecursion: false
                useLegacyPattern: false
                enableTelemetry: false
          - task: AzureCLI@2
            displayName: 'Adding IP Rule'
            inputs:
              azureSubscription: '${serviceConnection}'
              scriptType: 'bash'
              scriptLocation: 'inlineScript'
              inlineScript: |
                IP=$(curl curl https://ifconfig.me/ip)
                echo $IP
                az storage account network-rule add -g ${resourceGroupName} -n ${storageAccountName} --ip-address $IP
          #waiting for the IP to whitelist before deployment for 5 secs
          - script: sleep 25
          - task: AzureCLI@2
            displayName: 'Upload New Static Website'
            inputs:
              azureSubscription: '${serviceConnection}'
              scriptType: 'bash'
              scriptLocation: 'inlineScript'
              inlineScript: |
                az storage blob upload-batch --account-name ${storageAccountName} --destination "\$web" --source '$(Build.ArtifactStagingDirectory)/${appName}' --overwrite
          - task: AzureCLI@2
            displayName: "Removing IP Rule"
            name: removePipelineIPFromSqlServerAndKeyVault
            condition: succeededOrFailed()
            inputs:
              azureSubscription: '${serviceConnection}'
              scriptType: 'bash'
              scriptLocation: 'inlineScript'
              inlineScript: |
                IP=$(curl curl https://ifconfig.me/ip)
                az storage account network-rule remove -g ${resourceGroupName} -n ${storageAccountName} --ip-address $IP
  `;
};

export const buildStaticSiteDeploymentPipeline = (
  config: InitConfig,
  staticSiteConfig: StaticSiteConfig
) => `${buildResources()}

${buildParameters()}

${buildMatrix()}

${buildDeployJob()}
`;
