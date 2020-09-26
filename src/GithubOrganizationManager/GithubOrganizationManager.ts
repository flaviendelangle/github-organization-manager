import matcher from 'matcher'

import GithubOrganizationAPI from '../GithubOrganizationAPI'

export type GithubOrganizationManagerConfig = {
  organization: string
  token: string
  repositoryNamePattern: string
}

class GithubOrganizationManager {
  private api: GithubOrganizationAPI
  private readonly repositoryNamePattern: string

  constructor(config: GithubOrganizationManagerConfig) {
    this.api = new GithubOrganizationAPI(config.organization, config.token)
    this.repositoryNamePattern = config.repositoryNamePattern
  }

  private log = (message: string) => {
    // eslint-disable-next-line no-console
    console.log(message)
  }

  public buildDependencyList = async () => {
    this.log('Start fetching repositories')
    const repositoryList = await this.api.listRepositories()
    this.log('Finishes fetching repositories')

    const validRepositories = repositoryList.filter(
      (repository) =>
        !repository.isArchived &&
        matcher.isMatch(repository.name, this.repositoryNamePattern)
    )

    for (const repository of validRepositories) {
      this.log(`Fetching details for ${repository.name}`)
    }
  }
}

export default GithubOrganizationManager
