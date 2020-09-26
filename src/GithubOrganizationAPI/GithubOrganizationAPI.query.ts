const gql = (...args: TemplateStringsArray[]) =>
  args.map((arg) => (Array.isArray(arg) ? arg.join('') : arg)).join('')

export const organizationQuery = gql`
  query organizationRepositoriesList(
    $login: String!
    $first: Int
    $after: String
  ) {
    organization(login: $login) {
      name
      repositories(first: $first, after: $after) {
        totalCount
        edges {
          cursor
          node {
            id
            name
            isArchived
            releases(last: 1) {
              nodes {
                id
                tagName
              }
            }
          }
        }
      }
    }
  }
`
