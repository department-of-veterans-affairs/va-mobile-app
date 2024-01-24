// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

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
        },
      },

      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    },
}

module.exports = config
