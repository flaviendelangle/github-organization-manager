import { graphql } from '@octokit/graphql'

import { organizationQuery } from './GithubOrganizationAPI.query'
import {
  organizationRepositoriesList,
  organizationRepositoriesListVariables,
  organizationRepositoriesList_organization_repositories_edges_node,
} from './types/organizationRepositoriesList'

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
  ): Promise<
    organizationRepositoriesList_organization_repositories_edges_node[]
  > => {
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
      .filter(
        (node) => !!node
      ) as organizationRepositoriesList_organization_repositories_edges_node[]

    if (nextPageCursor) {
      const nextPages = await this.listRepositories(nextPageCursor)
      return [...nodes, ...nextPages]
    }

    return nodes
  }
}

export default GithubOrganizationAPI
