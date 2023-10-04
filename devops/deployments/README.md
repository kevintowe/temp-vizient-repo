# deployments

    Octopus last year,
    Azure DevOps now,
    Github next year,

CI/CD systems change. As a platform team, what if we define a simple library for generating standard application deployments. Software teams will consume this library from within their IaC programs.

We should build this library from the ground up such that it can utilize ADO deployments or GitHub deployments. Teams should require MINIMIAL configuration changes(less than 5??) to switch from ADO to GitHub. Azure and Pulumi will be the constants wheras deployment provider is configurable.

## Vizient DevOps Deployments

This is a library built for use in a pulumi program.
It exports an init function and application specific deployment functions.

Programatic deployments require certain metadata about your application infrastructure. This metadata is typically defined in your IaC code(think pulumi). That is in part why we define our deployments in our applications infrastructure code.  

These are the current deployments supported by this library. Please help make this more comprehensive.

Supported Deployments:

On the todo list:
- Static Site Deployments
    - Standard Storage Account $web hosting
- Function App Deployments
- App Service Deployments
    - Standard



