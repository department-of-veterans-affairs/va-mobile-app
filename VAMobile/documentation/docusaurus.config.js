// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/**
 * Function to form up configuration for Design System Engineering Docs imported from va-mobile-library repo
 * @param {string} name - Lower case name that must be unique; used for filename (sets URL for page) for some files
 * @param {string} URLextension - Directory in the library repo; if base directory set to empty string ('')
 * @param {Array<string>} documentsList - List of document names to pull in from library repo
 * @returns Formatted structure to import the relevant files for the "plugins" list of the Docusaurus config
 */
const engineeringDocForm = (name, URLextension, documentsList) => {
  return [
    'docusaurus-plugin-remote-content',
    {
      // https://github.com/rdilweb/docusaurus-plugin-remote-content?tab=readme-ov-file#alright-so-how-do-i-use-this
      name,
      sourceBaseUrl: `https://raw.githubusercontent.com/department-of-veterans-affairs/va-mobile-library/main/${URLextension}`,
      outDir: 'design/About/For engineers',
      documents: documentsList,
      modifyContent(filename, content) {
        let header = ''
        switch (filename) {
          case 'overview.md':
            header = `---\nsidebar_position: 1\n---\n\n`
            break
          case 'CHANGELOG.md':
          case 'README.md':
            const title = name.charAt(0).toUpperCase() + name.substring(1)
            filename = `${name}.md`
            header = `---\ntitle: ${title}\n---\n\n`
            break
        }
        return {
          filename,
          content: `${header}${content}`,
        }
      },
    },
  ]
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'VA: Health and Benefits app documentation',
  tagline: 'All the documentation for the VA mobile app',
  url: 'https://department-of-veterans-affairs.github.io/',
  baseUrl: '/va-mobile-app/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'department-of-veterans-affairs', // Usually your GitHub org/user name.
  projectName: 'va-mobile-app', // Usually your repo name.
  plugins: [
    './docusaurus-plugin-react-native-web',
    engineeringDocForm('documentation', 'documentation', [
      'contributing.md',
      'namingConventions.md',
      'overview.md',
      'testing.md',
      'versioning.md',
    ]),
    engineeringDocForm('changelog', '', ['CHANGELOG.md']),
    engineeringDocForm('assets', 'packages/assets', ['README.md']),
    engineeringDocForm('components', 'packages/components', ['README.md']),
    engineeringDocForm('linting', 'packages/linting', ['README.md']),
    engineeringDocForm('tokens', 'packages/tokens', ['README.md']),
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'design',
        path: 'design',
        routeBasePath: 'design',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      'docusaurus-plugin-react-docgen-typescript',
      {
        // pass in a single string or an array of strings
        src: ['../src/components/**/*.tsx', '../src/utils/hooks/*.tsx', '!../src/**/*test.*'],
        global: true,
        parserOptions: {
          // pass parserOptions to react-docgen-typescript
          // here is a good starting point which filters out all
          // types from react
          propFilter: (prop, component) => {
            if (prop.parent) {
              return !prop.parent.fileName.includes('@types/react')
            }

            return true
          },
        },
      },
    ],
    'docusaurus-lunr-search',
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [require('mdx-mermaid')],
          // Please change this to your repo.
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            route: '/api/',
            spec: 'https://raw.githubusercontent.com/department-of-veterans-affairs/vets-api/master/modules/mobile/docs/openapi.yaml',
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      navbar: {
        title: 'VA Mobile Docs',
        logo: {
          alt: 'VA Mobile logo',
          src: 'img/va-logo.png',
        },
        items: [
          {
            to: '/docs/Intro', // ./docs/Intro.md
            label: 'Documentation',
            position: 'left',
            activeBaseRegex: `/docs/`,
          },
          {
            to: '/design/Intro', // ./docs-api/Intro.md
            label: 'Design System',
            position: 'left',
            activeBaseRegex: `/design/`,
          },
          {
            href: 'https://github.com/department-of-veterans-affairs/va-mobile-app',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentation',
                to: '/docs/intro',
              },
              {
                label: 'Design System',
                to: '/design/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} VA Mobile App, Inc. Built with Docusaurus.`,
        logo: {
          src: 'img/va-blue-logo.png',
          alt: 'VA, United States Department of Veteran Affairs',
        },
      },

      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    },
}

module.exports = config
