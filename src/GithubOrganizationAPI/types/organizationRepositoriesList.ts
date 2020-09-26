/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: organizationRepositoriesList
// ====================================================

export interface organizationRepositoriesList_organization_repositories_edges_node_releases_nodes {
  __typename: "Release";
  id: string;
  /**
   * The name of the release's Git tag
   */
  tagName: string;
}

export interface organizationRepositoriesList_organization_repositories_edges_node_releases {
  __typename: "ReleaseConnection";
  /**
   * A list of nodes.
   */
  nodes: (organizationRepositoriesList_organization_repositories_edges_node_releases_nodes | null)[] | null;
}

export interface organizationRepositoriesList_organization_repositories_edges_node {
  __typename: "Repository";
  id: string;
  /**
   * The name of the repository.
   */
  name: string;
  /**
   * Indicates if the repository is unmaintained.
   */
  isArchived: boolean;
  /**
   * List of releases which are dependent on this repository.
   */
  releases: organizationRepositoriesList_organization_repositories_edges_node_releases;
}

export interface organizationRepositoriesList_organization_repositories_edges {
  __typename: "RepositoryEdge";
  /**
   * A cursor for use in pagination.
   */
  cursor: string;
  /**
   * The item at the end of the edge.
   */
  node: organizationRepositoriesList_organization_repositories_edges_node | null;
}

export interface organizationRepositoriesList_organization_repositories {
  __typename: "RepositoryConnection";
  /**
   * Identifies the total count of items in the connection.
   */
  totalCount: number;
  /**
   * A list of edges.
   */
  edges: (organizationRepositoriesList_organization_repositories_edges | null)[] | null;
}

export interface organizationRepositoriesList_organization {
  __typename: "Organization";
  /**
   * The organization's public profile name.
   */
  name: string | null;
  /**
   * A list of repositories that the user owns.
   */
  repositories: organizationRepositoriesList_organization_repositories;
}

export interface organizationRepositoriesList {
  /**
   * Lookup a organization by login.
   */
  organization: organizationRepositoriesList_organization | null;
}

export interface organizationRepositoriesListVariables {
  login: string;
  first?: number | null;
  after?: string | null;
}
