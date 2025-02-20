/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react'

import Link from '@docusaurus/Link'
import clsx from 'clsx'

import styles from './HomepageFeatures.module.css'

type FeatureItem = {
  title: string
  image: string
  alt: string
  description: JSX.Element
  useMobileImageCss?: boolean
}

const baseUrl = '/va-mobile-app'

const FeatureList: FeatureItem[] = [
  {
    title: 'VA: Health and Benefits',
    image: `${baseUrl}/img/va-logo.png`,
    alt: `Department of Veteran Affairs logo`,
    useMobileImageCss: true,
    description: (
      <>
        With the VA: Health and Benefits app, Veterans can manage the VA health care and benefits tasks they do most
        often—all in one simple app.
      </>
    ),
  },
  {
    title: 'React Native',
    image: `${baseUrl}/img/react-native-logo.png`,
    alt: `React Native logo`,
    description: (
      <>
        The front end is built using{' '}
        <Link href="https://reactnative.dev/" target="_blank" aria-label="React Native (opens in new window)">
          React Native
        </Link>
        .
      </>
    ),
  },
  {
    title: 'Ruby on Rails',
    image: `${baseUrl}/img/ruby-logo.png`,
    alt: `Ruby on Rails logo`,
    description: (
      <>
        The back end is built using{' '}
        <Link href="https://rubyonrails.org/" target="_blank" aria-label="Ruby on Rails (opens in new window)">
          Ruby on Rails
        </Link>
        .
      </>
    ),
  },
]

function Feature({ title, alt, image, description, useMobileImageCss }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={useMobileImageCss ? styles.mobilePhoneSvg : styles.featureSvg} alt={alt} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
        <h2>{title}</h2>
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
