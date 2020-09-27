import * as dotenv from 'dotenv'

import GithubOrganizationManager from './GithubOrganizationManager'

dotenv.config()

const main = async () => {
  const organization = process.env.GITHUB_ORGANIZATION
  const token = process.env.GITHUB_TOKEN

  if (!organization) {
    throw new Error('No organization found')
  }

  if (!token) {
    throw new Error('No token found')
  }

  const repositoryAPI = new GithubOrganizationManager({
    organization,
    token,
    repositoryNamePattern: 'client-*',
    dependencyNamePrefix: '@habx/',
  })
  await repositoryAPI.buildDependencyList()
}

main()
