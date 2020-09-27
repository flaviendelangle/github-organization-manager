/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: repositoryPackageJSON
// ====================================================

export interface repositoryPackageJSON_repository_packageJSON_Commit {
  __typename: "Commit" | "Tree" | "Tag";
}

export interface repositoryPackageJSON_repository_packageJSON_Blob {
  __typename: "Blob";
  /**
   * UTF8 text data or null if the Blob is binary
   */
  text: string | null;
}

export type repositoryPackageJSON_repository_packageJSON = repositoryPackageJSON_repository_packageJSON_Commit | repositoryPackageJSON_repository_packageJSON_Blob;

export interface repositoryPackageJSON_repository {
  __typename: "Repository";
  /**
   * A Git object in the repository
   */
  packageJSON: repositoryPackageJSON_repository_packageJSON | null;
}

export interface repositoryPackageJSON {
  /**
   * Lookup a given repository by the owner and repository name.
   */
  repository: repositoryPackageJSON_repository | null;
}

export interface repositoryPackageJSONVariables {
  repositoryName: string;
  repositoryOwner: string;
  packageJSONPath: string;
}
