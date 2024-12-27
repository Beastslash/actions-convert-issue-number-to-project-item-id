import core from "@actions/core"
import github from "@actions/github"
import { App, Octokit } from "octokit"

try {

  // Create the Octokit.
  const accessToken = core.getInput("github-token", {required: false});
  let octokit: Octokit | ReturnType<(typeof github)["getOctokit"]>;
  if (accessToken) {

    octokit = github.getOctokit(accessToken);

  } else {
      
    const appID = core.getInput("github-app-id", {required: true});
    const privateKey = core.getInput("github-app-private-key", {required: true});
    const installationID = parseInt(core.getInput("github-app-installation-id", {required: true}), 10);

    const app = new App({
      appId: appID,
      privateKey
    });
    
    octokit = await app.getInstallationOctokit(installationID); // Get the installation ID from the GitHub app settings.

  }

  // Get the item.
  const issueID = core.getInput("github-issue-id", {required: false});
  const issueNumber = parseInt(core.getInput("github-issue-number", {required: false}), 10) || github.context.issue.number;
  const projectID = core.getInput("github-project-id", {required: true});

  let response;
  let nodeID;
  do {

    response = await octokit.graphql<{
      node: {
        items: {
          nodes: {
            id: string;
            content: {
              id: string;
              number: number;
            }
          }[];
          pageInfo: {
            endCursor: string;
            hasNextPage: boolean;
          }
        }
      }
    }>(`
      query getProjectNodeID($projectID: ID!, $endCursor: String) {
        node(id: $projectID) {
          ... on ProjectV2 {
            items(first: 100, after: $endCursor) {
              nodes {
                id
                content {
                  ... on Issue {
                    id
                    number
                  }
                }
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      }
    `, {
      projectID,
      issueNumber
    });

    const itemNodes = response.node.items.nodes;
    const item = itemNodes.find((node) => node.content.id === issueID || node.content.number === issueNumber);
    nodeID = item?.id;

  } while (!nodeID && response.node.items.pageInfo.hasNextPage);

  if (!nodeID && core.getInput("should-fail-if-issue-not-found", {required: false})) {

    throw new Error("Project item ID not found.")

  } 

  core.setOutput("GITHUB_PROJECT_ITEM_ID", nodeID);

} catch (error) {

  core.setFailed(error instanceof Error ? error : "Unknown error.");

}