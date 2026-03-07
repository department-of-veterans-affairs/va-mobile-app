/**
 * 
 * This is an experimental script that should be considered as a WIP for now.
 * 
 * A utility script to help with QAing the VA Mobile App
 *
 * Async state pipeline (Context -> Promise<Context>)
 * [Args] -> pipe(parse, ..., deploy) -> [Side Effects]
 *
 * - Context (ctx) is a persistent state structure passed to every function.
 * - ctx has shape { cfg: Config, deviceId: String, cleanups: Array<() => void> }
 * - State only accumulates.
 * - 'cleanups' is a stack of closures binding resources to their specific tear=down logic at creation time.
 * - 'sh' and 'spawn' isolate shell side-effects.
 *
 * To extend or modify:
 * 1. Write function: (ctx) => Promise<ctx> | ctx
 * 2. Perform logic/side-effects
 * 3. Return updated or original ctx
 * 4. Insert into 'pipe' chain at the end of this file
 *
 */

const { execSync, spawn } = require('child_process')
const fs = require('fs')
const os = require('os')
const readline = require('readline')


// Functional Utils

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => v.then(f), Promise.resolve(x))

const tap = (fn) => async (x) => {
  await fn(x)
  return x
}

// Unsafe Exec
const sh = (cmd, opts = {}) => {
  try {
    const result = execSync(cmd, {
      encoding: 'utf8',
      stdio: opts.quiet ? 'pipe' : 'inherit',
      env: { ...process.env, ...ENV },
      ...opts,
    })
    // execSync returns null when stdio is 'inherit'
    return result ? result.trim() : ''
  } catch (e) {
    if (opts.nofail) return ''
    throw e
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const ask = (q) =>
  new Promise((r) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    rl.question(q, (a) => {
      rl.close()
      r(a)
    })
  })

const retry = async (fn, checks, delay = 1000) => {
  if (checks === 0) throw new Error('Timeout waiting for condition')
  if (await fn()) return true
  await sleep(delay)
  return retry(fn, checks - 1, delay)
}


// Config and Parsing

const ENV = {
  JAVA_HOME: '/Applications/Android Studio.app/Contents/jbr/Contents/Home',
  ANDROID_HOME: process.env.ANDROID_HOME || `${os.homedir()}/Library/Android/sdk`,
  get PATH() {
    return `${this.ANDROID_HOME}/platform-tools:${this.ANDROID_HOME}/emulator:${process.env.PATH}`
  },
}

const DEFAULT_CONFIG = {
  env: 'staging',
  mode: 'debug',
  clean: false,
  metro: true,
  logs: true,
  interactiveLogs: false,
  mitm: false,
  mitmPort: 8082,
  pr: null,
  branch: null,
  device: null,
  deepLink: null,
  a11y: false,
}

const ARG_MAP = {
  '-e': 'env',
  '--env': 'env',
  '-m': 'mode',
  '--mode': 'mode',
  '-d': 'device',
  '--device': 'device',
  '--pr': 'pr',
  '-b': 'branch',
  '--branch': 'branch',
  '--mitm-port': 'mitmPort',
  '-l': 'deepLink',
  '--link': 'deepLink',
}

const FLAGS = {
  '--clean': { clean: true },
  '--no-metro': { metro: false },
  '--no-logs': { logs: false },
  '--interactive-logs': { interactiveLogs: true },
  '--mitm': { mitm: true },
  '--a11y': { a11y: true },
  '-h': 'help',
  '--help': 'help',
}

const parseArgs = (argv) => {
  const args = argv.slice(2)

  const printHelp = () => {
    console.log(`
Usage: node dev-android.js [OPTIONS]

Options:
  -e, --env <env>         Environment (staging, production, local)
  -m, --mode <mode>       Build mode (debug, release)
  -d, --device <name>     Specify device/emulator
  --pr <number>           Checkout PR
  -b, --branch <name>     Checkout branch
  --clean                 Clean build
  --no-metro              Skip Metro
  --no-logs               Skip logs
  --interactive-logs      Use fzf for logs
  --mitm                  Enable mitmproxy (default port: 8082)
  --mitm-port <port>      mitmproxy port (default: 8082)
  -l, --link <url>        Trigger deep link
  --a11y                  Font scaling
  -h, --help              Show help

Examples:
  node dev-android.js
  node dev-android.js --pr 12345
  node dev-android.js --env production --mitm
`)
    process.exit(0)
  }

  const parse = (config, [head, ...tail]) => {
    // Base case
    if (!head) return config

    // Case 1: Help
    if (FLAGS[head] === 'help') printHelp()

    // Case 2: Boolean flags (consume 1)
    if (FLAGS[head]) {
      return parse({ ...config, ...FLAGS[head] }, tail)
    }

    // Case 3: Value flags (consume 2)
    const key = ARG_MAP[head]
    if (key) {
      const [value, ...rest] = tail
      if (!value) throw new Error(`Missing value for option: ${head}`)
      return parse({ ...config, [key]: value }, rest)
    }

    // Case 4: Unknown
    throw new Error(`Unknown option: ${head}`)
  }

  return { cfg: parse(DEFAULT_CONFIG, args), cleanups: [], deviceId: null }
}


// Domain Logic

// FIXME: all of this is a big old kludge
// TODO: if this is gonna get used by other folks, will need to harden how this script handles ENV stuff
const checkPrereqs = tap(({ cfg }) => {
  console.log('Checking prerequisites...')

  if (!fs.existsSync(ENV.JAVA_HOME)) {
    throw new Error(`Android Studio JDK not found at ${ENV.JAVA_HOME}`)
  }

  if (!fs.existsSync(ENV.ANDROID_HOME)) {
    throw new Error(`ANDROID_HOME not found at ${ENV.ANDROID_HOME}`)
  }

  const reqs = ['node', 'yarn', 'adb', 'emulator', ...(cfg.mitm ? ['mitmweb'] : []), ...(cfg.pr ? ['gh'] : [])]

  reqs.forEach((cmd) => {
    try {
      sh(`command -v ${cmd}`, { quiet: true })
    } catch {
      throw new Error(`${cmd} not found in PATH`)
    }
  })

  console.log('✓ Prerequisites OK\n')
})

const checkoutGit = tap(async ({ cfg }) => {
  if (!cfg.pr && !cfg.branch) return

  console.log('Git checkout...')
  sh('git fetch origin --quiet', { quiet: true })

  if (cfg.pr) {
    const prNum = cfg.pr.match(/\/pull\/(\d+)/)?.[1] || cfg.pr
    console.log(`Checking out PR #${prNum}...`)
    sh(`gh pr checkout ${prNum} --force`)
  } else {
    console.log(`Checking out branch ${cfg.branch}...`)
    const remote = sh(`git show-ref --verify refs/remotes/origin/${cfg.branch}`, { quiet: true, nofail: true })
    if (remote) {
      sh(`git checkout ${cfg.branch} 2>/dev/null || git checkout -b ${cfg.branch} origin/${cfg.branch}`, {
        quiet: true,
      })
    } else {
      sh(`git checkout ${cfg.branch}`, { quiet: true })
    }
  }

  console.log('Installing deps...')
  sh('yarn install', { quiet: true })

  const diff = sh('git diff --name-only HEAD@{1} HEAD 2>/dev/null || echo ""', { quiet: true, nofail: true })
  if (diff.includes('ios/Podfile')) {
    console.log('Updating CocoaPods...')
    sh('cd ios && pod install', { quiet: true })
  }

  console.log('✓ Git checkout complete\n')
})

const resolveDevice = async (ctx) => {
  const { cfg } = ctx
  console.log('Resolving device...')

  const lines = sh('adb devices -l', { quiet: true }).split('\n').slice(1).filter(Boolean)

  // Priority 1: Actual device
  const physical = lines.find((l) => l.includes('usb:'))
  if (physical) {
    const deviceId = physical.split(/\s+/)[0]
    console.log(`✓ Using physical device: ${deviceId}\n`)
    return { ...ctx, deviceId }
  }

  // Priority 2: Running emulator
  const running = lines.find((l) => l.includes('emulator-'))
  if (running) {
    const deviceId = running.split(/\s+/)[0]
    console.log(`✓ Using running emulator: ${deviceId}\n`)
    return { ...ctx, deviceId }
  }

  // Priority 3: Launch emulator
  let avd = cfg.device
  if (!avd) {
    const avds = sh('emulator -list-avds', { quiet: true }).split('\n').filter(Boolean)
    if (!avds.length) throw new Error('No AVDs found. Create one in Android Studio.')

    if (avds.length === 1) {
      avd = avds[0]
    } else {
      console.log('Available AVDs:')
      avds.forEach((a, i) => console.log(`  ${i + 1}. ${a}`))
      const choice = await ask(`\nSelect AVD (1-${avds.length}): `)
      avd = avds[parseInt(choice) - 1]
    }
  }

  console.log(`Launching emulator: ${avd}...`)
  const proc = spawn('emulator', ['-avd', avd], { detached: true, stdio: 'ignore' })
  proc.unref()

  // Wait for emulator
  await retry(() => sh('adb devices', { quiet: true }).includes('emulator-'), 60)
  const deviceId = sh('adb devices', { quiet: true }).match(/(emulator-\d+)/)?.[1]

  if (!deviceId) throw new Error('Failed to detect emulator')

  // Wait for boot
  console.log('Waiting for boot...')
  await retry(
    () => {
      try {
        return sh(`adb -s ${deviceId} shell getprop sys.boot_completed`, { quiet: true, nofail: true }).trim() === '1'
      } catch {
        return false
      }
    },
    120,
    2000,
  )

  console.log(`✓ Emulator booted: ${deviceId}\n`)
  return { ...ctx, deviceId }
}

const clearDeviceProxy = tap(({ deviceId }) => {
  if (!deviceId) return

  const currentProxy = sh(`adb -s ${deviceId} shell settings get global http_proxy`, { quiet: true, nofail: true })
  if (currentProxy && currentProxy !== ':0') {
    console.log(`Device has proxy set to ${currentProxy}, clearing...`)
    sh(`adb -s ${deviceId} shell settings put global http_proxy :0`, { quiet: true, nofail: true })
    console.log('✓ Device proxy cleared\n')
  }
})

const setupMitm = async (ctx) => {
  if (!ctx.cfg.mitm) return ctx

  const { deviceId } = ctx
  const { mitmPort } = ctx.cfg

  const running = sh(`lsof -i :${mitmPort} 2>/dev/null || echo ""`, { quiet: true, nofail: true })
  if (running.includes('mitmweb')) {
    console.log(`✓ mitmweb already running on ${mitmPort}\n`)
    // Assumes the proxy setting on the device is still valid or will be overwritten
    sh(`adb -s ${ctx.deviceId} shell settings put global http_proxy 10.0.2.2:${mitmPort}`)
    return ctx
  }

  console.log(`Starting mitmweb on port ${mitmPort}...`)
  const proc = spawn('mitmweb', ['--web-port', '8083', '--listen-port', String(mitmPort)], {
    detached: true,
    stdio: 'ignore',
  })
  proc.unref()

  // Wait for port to get claimed
  await retry(
    () => sh(`lsof -i :${mitmPort} 2>/dev/null || echo ""`, { quiet: true, nofail: true }).includes('mitmweb'),
    10,
  )

  sh(`adb -s ${ctx.deviceId} shell settings put global http_proxy 10.0.2.2:${mitmPort}`)

  // Register exit handler immediately for defense in depth
  const cleanupProxy = () => {
    try {
      sh(`adb -s ${ctx.deviceId} shell settings put global http_proxy :0`, { quiet: true, nofail: true })
    } catch {}
  }
  process.once('exit', cleanupProxy)
  process.once('SIGINT', cleanupProxy)
  process.once('SIGTERM', cleanupProxy)

  console.log('✓ mitmweb started')
  console.log('  Web interface: http://localhost:8083')
  console.log('  Install certificate: ')
  console.log('  from your test device, visit http://mitm.it\n')

  await ask('Press Enter when certificate is installed...')

  return {
    ...ctx,
    cleanups: [
      ...ctx.cleanups,
      () => {
        try {
          process.kill(proc.pid)
        } catch {}
        try {
          sh(`adb -s ${ctx.deviceId} shell settings put global http_proxy :0`, { quiet: true, nofail: true })
        } catch {}
      },
    ],
  }
}

const setupMetro = async (ctx) => {
  if (!ctx.cfg.metro) return ctx

  // Check if Metro already running
  const running = sh('lsof -i :8081 2>/dev/null || echo ""', { quiet: true, nofail: true })
  if (running.includes('node')) {
    console.log('✓ Metro already running\n')
    return ctx
  }

  console.log('Starting Metro bundler...')
  const proc = spawn('yarn', ['start:metro-server'], { detached: true, stdio: 'ignore' })
  proc.unref()

  await retry(() => {
    const check = sh('lsof -i :8081 2>/dev/null || echo ""', { quiet: true, nofail: true })
    return check.includes('node')
  }, 30)

  console.log('✓ Metro started\n')

  return {
    ...ctx,
    cleanups: [
      ...ctx.cleanups,
      () => {
        try {
          process.kill(proc.pid)
        } catch {}
      },
    ],
  }
}

const buildDeploy = tap(({ cfg, deviceId }) => {
  const variant = cfg.mode === 'release' ? 'release' : 'debug'

  console.log(`Environment: ${cfg.env}`)
  console.log(`Mode: ${variant}`)
  console.log(`Device: ${deviceId}\n`)

  const envCmd =
    {
      staging: 'yarn env:staging',
      production: 'yarn env:production',
      local: 'yarn env:local',
    }[cfg.env] || 'yarn env:staging'

  sh(envCmd, { quiet: true })

  if (cfg.clean) {
    console.log('Cleaning build...')
    sh('cd android && ./gradlew clean')
  }

  console.log('Building...')
  sh(`npx react-native run-android --mode ${variant}`)

  const apkPath = `android/app/build/outputs/apk/${variant}/app-${variant}.apk`
  if (!fs.existsSync(apkPath)) {
    throw new Error(`APK not found at ${apkPath}`)
  }

  // Force install to selected device
  console.log(`\nInstalling to ${deviceId}...`)
  sh(`adb -s ${deviceId} install -r "${apkPath}"`) // FIXME: gotta handle failures, they'll bubble up, but not retry

  console.log('Launching app...')
  sh(`adb -s ${deviceId} shell am start -n gov.va.mobileapp/.MainActivity`, { quiet: true })
})

const configureApp = async (ctx) => {
  const { cfg, deviceId } = ctx

  // Deep link
  if (cfg.deepLink) {
    console.log(`Triggering deep link: ${cfg.deepLink}`)
    await sleep(5000)
    sh(`adb -s ${deviceId} shell am start -W -a android.intent.action.VIEW -d "${cfg.deepLink}" gov.va.mobileapp`, {
      quiet: true,
      nofail: true,
    })
  }

  // Accessibility - font scaling
  if (cfg.a11y) {
    console.log('\nFont Scaling:')
    console.log('  1) Normal (1.0x)')
    console.log('  2) Large (1.3x)')
    console.log('  3) Extra Large (2.0x)')
    console.log('  4) Skip')

    const choice = await ask('\nSelect (1-4): ')
    const scales = { 1: '1.0', 2: '1.3', 3: '2.0' }

    if (scales[choice]) {
      sh(`adb -s ${deviceId} shell settings put system font_scale ${scales[choice]}`, { quiet: true })
      console.log(`✓ Font scale set to ${scales[choice]}x\n`)

      // Register cleanup to restore default font scale
      return {
        ...ctx,
        cleanups: [
          ...ctx.cleanups,
          () => {
            try {
              sh(`adb -s ${deviceId} shell settings put system font_scale 1.0`, { quiet: true, nofail: true })
            } catch {}
          },
        ],
      }
    }
  }

  return ctx
}

const streamLogs = (ctx) => {
  if (!ctx.cfg.logs) {
    return ctx
  }

  const { deviceId, cleanups, cfg } = ctx
  console.log('Press Ctrl+C to exit\n')

  const cleanup = () => {
    console.log('\nCleaning up...')
    cleanups.forEach((fn) => {
      try {
        fn()
      } catch {}
    })
    console.log('✓ Cleanup complete')
    process.exit(0)
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)

  // Searchable logs with fzf
  if (cfg.interactiveLogs) {
    const hasFzf = sh('command -v fzf', { quiet: true, nofail: true })
    if (hasFzf) {
      const logcat = spawn('adb', ['-s', deviceId, 'logcat', '-T', '1'], { stdio: ['ignore', 'pipe', 'ignore'] })
      const grep = spawn('grep', ['--line-buffered', '-E', 'gov.va.mobileapp|ReactNative|ReactNativeJS'], {
        stdio: [logcat.stdout, 'pipe', 'ignore'],
      })
      const fzf = spawn('fzf', ['--ansi', '--reverse', '--no-sort'], { stdio: [grep.stdout, 'inherit', 'ignore'] })

      return new Promise(() => {}) // Keep alive
    }
  }

  const logcat = spawn('adb', ['-s', deviceId, 'logcat', '-T', '1'], { stdio: ['ignore', 'pipe', 'ignore'] })
  const grep = spawn('grep', ['--line-buffered', '-E', 'gov.va.mobileapp|ReactNative|ReactNativeJS'], {
    stdio: [logcat.stdout, 'inherit', 'ignore'],
  })

  return new Promise(() => {}) // Keep alive until signal
}


// Main Pipeline

pipe(
  parseArgs,
  checkPrereqs,
  checkoutGit,
  resolveDevice,
  clearDeviceProxy,
  setupMitm,
  setupMetro,
  buildDeploy,
  configureApp,
  streamLogs,
)(process.argv).catch((err) => {
  console.error(`\n✗ ERROR: ${err.message}\n`)
  process.exit(1)
})
