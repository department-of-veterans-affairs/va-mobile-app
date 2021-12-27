// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'VA: Health and Benefits app documentation',
  tagline: 'All the documentation for the VA mobile app',
  url: 'https://didactic-lamp-12152085.pages.github.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'department-of-veterans-affairs', // Usually your GitHub org/user name.
  projectName: 'va-mobile-app', // Usually your repo name.
  plugins: [
    'docusaurus-plugin-relative-paths',
    './docusaurus-plugin-react-native-web',
    [
      'docusaurus-plugin-react-docgen-typescript',
      {
        // pass in a single string or an array of strings
        src: ['../src/components/**/*.tsx', '../src/utils/hooks.tsx', '!../src/**/*test.*'],
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
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
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
            routePath: '/api/',
            specUrl: 'https://raw.githubusercontent.com/department-of-veterans-affairs/vets-api/master/modules/mobile/docs/openapi.yaml',
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
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation',
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
