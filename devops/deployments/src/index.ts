export { configureDeployments } from './lib/configure-deployments';

/**
 * We need to think with a pulumi minset as we build this library. Each build function will extend
 * the pulumi component object wheras the init function maybe could be a provider object?
 * 
 * I feel like we are close to being a pulumi provider, but in reality we are just extending either
 * the ADO provider or the GitHub provider. So IDK. Someone think about it.
 * 
 * Back to the pulumi mindset, if our provider function(the init function) fails, I'm not sure
 * we should exit the process, but instead designate the provider as `failed to instantiate` and 
 * then the buildFunctions would detect the lack of a provider and simply immediately fail to perform
 * even perform a pulumi up for those build functions.
 * 
 * 1. Init a provider which will be used by the subsequent build functions.
 * 2. Build a 
 */

