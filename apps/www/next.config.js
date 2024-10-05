await import('./src/env.js');

/**
 * @param {boolean} isServer
 * @param {{ experiments: any; module: { rules: { test: RegExp; type: string; }[]; }; output: { webassemblyModuleFilename: string; }; }} config
 */
function patchWasmModuleImport(isServer, config) {
  config.experiments = Object.assign(config.experiments || {}, {
    asyncWebAssembly: true,
  });

  config.module.rules.push({
    test: /\.wasm$/,
    type: 'webassembly/async',
  });

  if (isServer) {
    config.output.webassemblyModuleFilename =
      './../static/wasm/[modulehash].wasm';
  } else {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
  }
}

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config, { isServer }) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.fallback = { fs: false , path: false, util: false };
    patchWasmModuleImport(isServer, config);

    return config;
  },
};

export default config;
