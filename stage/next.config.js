// @ts-check

const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const withPlugins = require('next-compose-plugins');
const { patchWebpackConfig: patchForGlobalCSS } = require('next-global-css');
const withTranspileModules = require('next-transpile-modules')([]);
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
/**
 * @type {import('next').NextConfig}
 **/
module.exports = withPlugins([withTranspileModules], {
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack: (config, options) => {
		// These 'react' related configs are added to enable linking packages in development
		// (e.g. Arranger), and not get the "broken Hooks" warning.
		// https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react
		if (options.isServer) {
			config.externals = ['react', ...config.externals];
		} else {
			options.dev &&
				config.plugins.push(new ForkTsCheckerWebpackPlugin()) &&
				config.plugins.push(
					new ExtraWatchWebpackPlugin({
						dirs: [path.resolve(__dirname, '.', 'node_modules', 'react')],
					}),
				);
		}

		config.resolve.alias['@emotion/react'] = path.resolve(__dirname, '.', 'node_modules', '@emotion/react');
		config.resolve.alias['react'] = path.resolve(__dirname, '.', 'node_modules', 'react');

		process.env.NODE_ENV === 'development' && (config.optimization.minimize = false);

		return patchForGlobalCSS(config, options);
	},

	// Not including the QUICKSEARCH ENVs, removed ADMIN UI
	publicRuntimeConfig: {
		EGO_PUBLIC_KEY: (process.env.EGO_PUBLIC_KEY || '').replace(/\\n/g, '\n'),
		NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
		NEXT_PUBLIC_APP_COMMIT: process.env.APP_COMMIT,
		NEXT_PUBLIC_APP_VERSION: process.env.APP_VERSION,

		// Composition
		NEXT_PUBLIC_ARRANGER_COMPOSITION_API: process.env.NEXT_PUBLIC_ARRANGER_COMPOSITION_API,
		NEXT_PUBLIC_ARRANGER_COMPOSITION_DOCUMENT_TYPE: process.env.NEXT_PUBLIC_ARRANGER_COMPOSITION_DOCUMENT_TYPE,
		NEXT_PUBLIC_ARRANGER_COMPOSITION_INDEX: process.env.NEXT_PUBLIC_ARRANGER_COMPOSITION_INDEX,
		NEXT_PUBLIC_ARRANGER_COMPOSITION_CARDINALITY_PRECISION_THRESHOLD:
			process.env.NEXT_PUBLIC_ARRANGER_COMPOSITION_CARDINALITY_PRECISION_THRESHOLD || 3000,
		NEXT_PUBLIC_ARRANGER_COMPOSITION_MANIFEST_COLUMNS:
			process.env.NEXT_PUBLIC_ARRANGER_COMPOSITION_MANIFEST_COLUMNS || '',
		NEXT_PUBLIC_ARRANGER_COMPOSITION_MAX_BUCKET_COUNTS:
			process.env.NEXT_PUBLIC_ARRANGER_COMPOSITION_MAX_BUCKET_COUNTS || 1000,

		// Insturment
		NEXT_PUBLIC_ARRANGER_INSTRUMENT_API: process.env.NEXT_PUBLIC_ARRANGER_INSTRUMENT_API,
		NEXT_PUBLIC_ARRANGER_INSTRUMENT_DOCUMENT_TYPE: process.env.NEXT_PUBLIC_ARRANGER_INSTRUMENT_DOCUMENT_TYPE,
		NEXT_PUBLIC_ARRANGER_INSTRUMENT_INDEX: process.env.NEXT_PUBLIC_ARRANGER_INSTRUMENT_INDEX,
		NEXT_PUBLIC_ARRANGER_INSTRUMENT_CARDINALITY_PRECISION_THRESHOLD:
			process.env.NEXT_PUBLIC_ARRANGER_INSTRUMENT_CARDINALITY_PRECISION_THRESHOLD || 3000,
		NEXT_PUBLIC_ARRANGER_INSTRUMENT_MANIFEST_COLUMNS:
			process.env.NEXT_PUBLIC_ARRANGER_INSTRUMENT_MANIFEST_COLUMNS || '',
		NEXT_PUBLIC_ARRANGER_INSTRUMENT_MAX_BUCKET_COUNTS:
			process.env.NEXT_PUBLIC_ARRANGER_INSTRUMENT_MAX_BUCKET_COUNTS || 1000,

		// Growth
		NEXT_PUBLIC_ARRANGER_GROWTH_API: process.env.NEXT_PUBLIC_ARRANGER_GROWTH_API,
		NEXT_PUBLIC_ARRANGER_GROWTH_DOCUMENT_TYPE: process.env.NEXT_PUBLIC_ARRANGER_GROWTH_DOCUMENT_TYPE,
		NEXT_PUBLIC_ARRANGER_GROWTH_INDEX: process.env.NEXT_PUBLIC_ARRANGER_GROWTH_INDEX,
		NEXT_PUBLIC_ARRANGER_GROWTH_CARDINALITY_PRECISION_THRESHOLD:
			process.env.NEXT_PUBLIC_ARRANGER_GROWTH_CARDINALITY_PRECISION_THRESHOLD || 3000,
		NEXT_PUBLIC_ARRANGER_GROWTH_MANIFEST_COLUMNS:
			process.env.NEXT_PUBLIC_ARRANGER_GROWTH_MANIFEST_COLUMNS || '',
		NEXT_PUBLIC_ARRANGER_GROWTH_MAX_BUCKET_COUNTS:
			process.env.NEXT_PUBLIC_ARRANGER_GROWTH_MAX_BUCKET_COUNTS || 1000,

		// using ASSET_PREFIX for the public runtime BASE_PATH because basePath in the top level config was not working
		// with the dms reverse proxy setup
		NEXT_PUBLIC_BASE_PATH: process.env.ASSET_PREFIX,
		NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG,
		NEXT_PUBLIC_EGO_API_ROOT: process.env.NEXT_PUBLIC_EGO_API_ROOT,
		NEXT_PUBLIC_EGO_CLIENT_ID: process.env.NEXT_PUBLIC_EGO_CLIENT_ID,
		NEXT_PUBLIC_KEYCLOAK_HOST: process.env.NEXT_PUBLIC_KEYCLOAK_HOST,
		NEXT_PUBLIC_KEYCLOAK_REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
		NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
		NEXT_PUBLIC_KEYCLOAK_PERMISSION_AUDIENCE: process.env.NEXT_PUBLIC_KEYCLOAK_PERMISSION_AUDIENCE,
		NEXT_PUBLIC_LAB_NAME: process.env.NEXT_PUBLIC_LAB_NAME,
		NEXT_PUBLIC_LOGO_FILENAME: process.env.NEXT_PUBLIC_LOGO_FILENAME,
		NEXT_PUBLIC_SSO_PROVIDERS: process.env.NEXT_PUBLIC_SSO_PROVIDERS,
		NEXT_PUBLIC_UI_VERSION: process.env.npm_package_version,
		NEXT_PUBLIC_ENABLE_COMPOSITION_QUICKSEARCH: process.env.NEXT_PUBLIC_ENABLE_COMPOSITION_QUICKSEARCH,
		NEXT_PUBLIC_ENABLE_INSTRUMENT_QUICKSEARCH: process.env.NEXT_PUBLIC_ENABLE_INSTRUMENT_QUICKSEARCH,
		NEXT_PUBLIC_ENABLE_REGISTRATION: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION,
	},
	assetPrefix: process.env.ASSET_PREFIX || '',
	optimizeFonts: false,
	experimental: {
		esmExternals: 'loose',
	},
});
