# actions-get-project-item-id-from-issue
A GitHub action used to get a project item ID from an issue number or ID.

## Inputs
| Name | Description | Required? |
| :- | :- | :- |
| `github-project-id` | The ID (not number) of the project that links to the issue. If you don't know the project ID, consider using [get-project-id-from-number](https://github.com/Beastslash/actions-get-project-id-from-number). | Yes |
| `github-issue-number` | The number of the issue that you want to find the item ID of. Defaults to the triggering issue. | Only if the workflow isn't caused due to an issue and if `github-issue-id` is not provided. |
| `github-issue-id` | The ID of the issue that you want to find the item ID of. | Only if the workflow isn't caused due to an issue and if `github-issue-number` is not provided. |
| `should-fail-if-issue-not-found` | If true, the workflow will fail if the issue isn't found; otherwise, the output will be undefined. | No |
| `github-app-id` | The app ID of the GitHub app that you are authenticating with. | Only if `github-personal-access-token` is not provided |
| `github-app-private-key` | A private key of the GitHub app that you are authenticating with. | Only if `github-personal-access-token` is not provided |
| `github-app-installation-id` | The ID of the installation that you are authenticating with.<br /><br />You can get this from checking the URL after hitting "Configure" at `https://github.com/{USER or ORGANIZATION}/{REPOSITORY}/settings/installations`. | Only if `github-personal-access-token` is not provided |
| `github-personal-access-token` | The personal access token that you are authenticating with. [GITHUB_TOKEN won't work because they currently cannot access projects.](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/automating-projects-using-actions#github-actions-workflows) | Only if `github-app-id`, `github-app-private-key`, and `github-app-installation-id` are not provided |

## Outputs
| Name | Description |
| :- | :- |
| `GITHUB_PROJECT_ITEM_ID` | The requested project item ID. Can be an empty string (`0`) if `should-fail-if-issue-not-found` isn't provided. |

## Permissions
Your GitHub app installation or your personal access token must have at least the following permissions:
* Read access to issues (Repository permissions > Issues)
* Read access to projects (Organization permissions > Projects)

## Example usage
```yml
- name: Convert issue number to project item ID
  id: convert_issue_number_to_project_item_id
  uses: Beastslash/actions-get-project-item-id-from-issue@v1.0.1
  with:
    github-project-id: ${{ steps.convert_project_number_to_id.outputs.GITHUB_PROJECT_ID }}
    github-app-id: ${{ vars.ISSUES_SYNC_GITHUB_APP_ID }}
    github-app-private-key: ${{ secrets.ISSUES_SYNC_GITHUB_APP_PRIVATE_KEY }}
    github-app-installation-id: ${{ vars.ISSUES_SYNC_GITHUB_APP_INSTALLATION_ID }}
```