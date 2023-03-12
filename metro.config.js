const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('js', 'jsx', 'json', 'ts', 'tsx', 'cjs');

config.resolver.assetExts.push('png', 'jpg', 'ttf');

module.exports = config;
