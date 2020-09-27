import { RepositoryBasicInformation } from '../GithubOrganizationAPI'

export type RepositoryDependency = {
  repository: RepositoryBasicInformation
  version: string
}

export type Dependency = {
  npmName: string
  githubName: string
  usedInRepositories: RepositoryDependency[]
}

export type Dependencies = { [npmName: string]: Dependency }
