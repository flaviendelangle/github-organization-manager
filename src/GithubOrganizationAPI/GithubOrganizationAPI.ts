import { graphql } from '@octokit/graphql'
import { AbbreviatedVersion as PackageJSON } from 'package-json'

import { RepositoryBasicInformation } from './GithubOrganizationAPI.interface'
import {
  organizationQuery,
  repositoryPackageJSONQuery,
} from './GithubOrganizationAPI.query'
import {
  organizationRepositoriesList,
  organizationRepositoriesListVariables,
} from './types/organizationRepositoriesList'
import {
  repositoryPackageJSON,
  repositoryPackageJSON_repository_packageJSON_Blob,
  repositoryPackageJSONVariables,
} from './types/repositoryPackageJSON'

class GithubOrganizationAPI {
  private readonly organization: string
  private readonly api: typeof graphql

  constructor(organization: string, token: string) {
    this.organization = organization

    this.api = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    })
  }

  public query = async <Data, Variables>(
    query: string,
    variables: Variables
  ): Promise<Data> => {
    return await this.api<Data>({ query, ...variables })
  }

  public listRepositories = async (
    cursor?: string
  ): Promise<RepositoryBasicInformation[]> => {
    const repositories = await this.query<
      organizationRepositoriesList,
      organizationRepositoriesListVariables
    >(organizationQuery, {
      login: this.organization,
      after: cursor,
      first: 100,
    })

    const edges = repositories.organization?.repositories.edges

    if (!edges) {
      return []
    }

    const nextPageCursor = edges[edges.length - 1]?.cursor
    const nodes = edges
      .map((edge) => edge?.node)
      .filter((node) => !!node) as RepositoryBasicInformation[]

    if (nextPageCursor) {
      const nextPages = await this.listRepositories(nextPageCursor)
      return [...nodes, ...nextPages]
    }

    return nodes
  }

  public getRepositoryPackageJSON = async (
    repository: RepositoryBasicInformation
  ): Promise<PackageJSON> => {
    if (!repository.defaultBranchRef?.name) {
      throw new Error(`Repository ${repository.name} has no default branch`)
    }

    const response = await this.query<
      repositoryPackageJSON,
      repositoryPackageJSONVariables
    >(repositoryPackageJSONQuery, {
      repositoryName: repository.name,
      repositoryOwner: this.organization,
      packageJSONPath: `${repository.defaultBranchRef.name}:package.json`,
    })

    if (!response.repository?.packageJSON) {
      throw new Error(`No package.json found on ${repository.name}`)
    }

    const packageJSON = response.repository
      .packageJSON as repositoryPackageJSON_repository_packageJSON_Blob

    if (!packageJSON.text) {
      throw new Error(`Package.json empty on ${repository.name}`)
    }

    return JSON.parse(packageJSON.text)
  }
}

export default GithubOrganizationAPI
