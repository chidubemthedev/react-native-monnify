# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**react-native-monnify** is an Expo-friendly React Native library that wraps the [Monnify Web SDK](https://monnify.com/) for payment integration. It provides a simple component-based API for integrating Monnify payments in both Expo-managed and bare React Native applications.

**Key characteristics:**
- Published to npm: `react-native-monnify`
- WebView-based integration (no native bridge needed)
- Fully TypeScript
- Supports both TEST and LIVE modes
- Handles payment splitting via `incomeSplitConfig`

## Architecture

The library follows a simple, single-component architecture:

1. **Monnify Component** (`src/monnify.tsx`): The main React Native component that wraps Monnify in a Modal with WebView. Handles cross-platform differences (iOS gets animated close button with platform-specific styling).

2. **HTML Generator** (`src/utils/generateHtml.ts`): Generates an HTML page that loads the Monnify Web SDK from a CDN and configures it with payment parameters. Uses `postMessage` to communicate events (onComplete, onError, onClose, onLoadStart, onLoadComplete) back to React Native.

3. **Types** (`src/types.ts`): Defines `MonnifyPaymentParams` interface for payment configuration and `MonnifyProps` for component props.

**Communication Flow:**
- React Native app passes payment params to Monnify component
- Component generates HTML with SDK config
- WebView loads HTML and initializes Monnify SDK
- SDK lifecycle events trigger postMessage calls
- Component handles messages and invokes callbacks (onSuccess, onError, onDismiss)

**Platform-specific behavior:**
- iOS: Animated close button fades in; `scalesPageToFit` disabled for layout fidelity
- Android: `scalesPageToFit` enabled; close button handled by hardware back button

## Common Development Tasks

### Build and Test
```bash
# Install dependencies
npm install

# Build (TypeScript → ES5, outputs to dist/)
npm run build

# Test the package locally
npm pack  # creates react-native-monnify-1.0.1.tgz
# Then in a test project: npm install path/to/react-native-monnify-1.0.1.tgz
```

### Watch for Changes During Development
TypeScript does not have a native watch mode in package.json. If iterating quickly, you can run:
```bash
npx tsc --watch
```

## Key Files and Their Responsibilities

- `src/monnify.tsx`: Main React component with Modal, WebView, and event handling
- `src/utils/generateHtml.ts`: Monnify SDK initialization code generation
- `src/types.ts`: Payment parameter and component prop interfaces
- `src/index.ts`: Barrel export (component + types)
- `tsconfig.json`: TypeScript compiler configuration (ES5 target, strict mode, JSX support)
- `package.json`: Package metadata, peer dependencies, build scripts

## Important Notes for Development

### HTML Generation and Injection
The `generateHtml` function dynamically generates HTML by embedding a JSON config string. This approach:
- Avoids string concatenation pitfalls
- Keeps the HTML template readable
- Ensures all parameters are properly JSON-serialized

If adding new payment parameters, update both `types.ts` and `generateHtml.ts`.

### Event Handling
The WebView listens for postMessage events from the embedded JavaScript. Events are keyed by the `event` field in the posted object. Currently supported:
- `onComplete`: Payment successful
- `onError`: Payment failed
- `onClose`: Modal/payment dismissed
- `onLoadStart` / `onLoadComplete`: Loading state (not surfaced to callbacks currently)

### Peer Dependencies
The library requires `react-native-webview` (≥11.0.0) as a peer dependency. This is not bundled—consumers must install it separately. The README's installation instructions emphasize this.

### Monnify SDK Availability
The HTML relies on the Monnify Web SDK being available at `https://sdk.monnify.com/plugin/monnify.js`. If that URL changes or becomes unavailable, the SDK initialization will fail and post an error event.

### TypeScript Configuration
- **Target:** ES5 (for broad compatibility)
- **Module:** ESNext (emit ES6 imports/exports; bundlers handle the rest)
- **Strict mode:** Enabled (required for library code)
- **JSX:** React (compiles JSX, no automatic runtime)

## Testing Strategy

Currently, there are no unit tests in the repo (`package.json` has `test: "echo \"Error: no test specified\" && exit 1"`). If adding tests:
- Consider testing the HTML generation in `generateHtml.ts`
- Integration tests would require a React Native test environment (e.g., Jest with react-native preset)
- Component behavior (event handling, modal visibility) is best tested with an integration test or manual testing in an app

## Deployment and Publishing

The package is published to npm. The `prepare` script runs `npm run build` automatically before publishing, so ensure `dist/` is fresh.

When bumping version:
1. Update `package.json` version
2. Commit the change
3. Tag the commit
4. `npm publish` (runs prepare → build automatically)
