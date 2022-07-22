/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react'
import clsx from 'clsx'
import styles from './HomepageFeatures.module.css'
import Link from '@docusaurus/Link'

type FeatureItem = {
  title: string
  image: string
  description: JSX.Element
  useMobileImageCss?: boolean
}

const baseUrl = '/va-mobile-app'

const FeatureList: FeatureItem[] = [
  {
    title: 'VA: Health and Benefits App',
    image: `${baseUrl}/img/va-logo.png`,
    useMobileImageCss: true,
    description: <>The mobile app allows Veterans to more easily complete key transactions across VA health and benefits services.</>,
  },
  {
    title: 'React Native',
    image: `${baseUrl}/img/react-native-logo.png`,
    description: (
      <>
        The <code>front end</code> is built using{' '}
        <Link href="https://reactnative.dev/" target="_blank">
          React Native
        </Link>
        .
      </>
    ),
  },
  {
    title: 'Ruby on Rails',
    image: `${baseUrl}/img/ruby-logo.png`,
    description: (
      <>
        The <code>back end</code> is built using{' '}
        <Link href="https://rubyonrails.org/" target="_blank">
          Ruby on Rails
        </Link>
        .
      </>
    ),
  },
]

function Feature({ title, image, description, useMobileImageCss }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={useMobileImageCss ? styles.mobilePhoneSvg : styles.featureSvg} alt={title} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
