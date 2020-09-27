import { keyBy } from 'lodash'
import matcher from 'matcher'

import GithubOrganizationAPI from '../GithubOrganizationAPI'

import { Dependencies } from './GithubOrganizationManager.interface'

export type GithubOrganizationManagerConfig = {
  organization: string
  token: string
  repositoryNamePattern: string
  dependencyNamePrefix: string
}

class GithubOrganizationManager {
  private api: GithubOrganizationAPI
  private readonly repositoryNamePattern: string
  private readonly dependencyNamePrefix: string

  constructor(config: GithubOrganizationManagerConfig) {
    this.api = new GithubOrganizationAPI(config.organization, config.token)
    this.repositoryNamePattern = config.repositoryNamePattern
    this.dependencyNamePrefix = config.dependencyNamePrefix
  }

  private log = (message: string) => {
    // eslint-disable-next-line no-console
    console.log(message)
  }

  public buildDependencyList = async () => {
    this.log('Start fetching repositories')
    const repositoryList = await this.api.listRepositories()
    this.log('Finished fetching repositories')

    const repositoriesByName = keyBy(
      repositoryList,
      (repository) => repository.name
    )

    const validRepositories = repositoryList.filter(
      (repository) =>
        !repository.isArchived &&
        matcher.isMatch(repository.name, this.repositoryNamePattern)
    )

    const dependencies: Dependencies = {}

    for (const repository of validRepositories) {
      this.log(`Fetching details for ${repository.name}`)
      const packageJSON = await this.api.getRepositoryPackageJSON(repository)

      const allRepositoryDependencies = packageJSON.dependencies ?? {}
      for (const npmDependencyName in allRepositoryDependencies) {
        if (
          allRepositoryDependencies.hasOwnProperty(npmDependencyName) &&
          npmDependencyName.startsWith(this.dependencyNamePrefix)
        ) {
          if (!dependencies[npmDependencyName]) {
            dependencies[npmDependencyName] = {
              npmName: npmDependencyName,
              githubName: npmDependencyName.replace(
                new RegExp(`^${this.dependencyNamePrefix}`),
                ''
              ),
              usedInRepositories: [],
            }
          }

          dependencies[npmDependencyName].usedInRepositories.push({
            repository,
            version: allRepositoryDependencies[npmDependencyName],
          })
        }
      }
    }

    for (const npmDependencyName in dependencies) {
      if (dependencies.hasOwnProperty(npmDependencyName)) {
        const githubName = dependencies[npmDependencyName].githubName
        const repository = repositoriesByName[githubName]

        if (!repository) {
          this.log(
            `No repository found for dependency ${githubName} (${npmDependencyName})`
          )
          continue
        }

        const version = repository.releases.nodes?.[0]?.tagName

        if (!version) {
          this.log(`Dependency ${githubName} (${npmDependencyName}) has no tag`)
          continue
        }
      }
    }
  }
}

export default GithubOrganizationManager
