function isWebpack(caller) {
    return Boolean(caller && caller.name === 'babel-loader');
}

module.exports = (api) => {
    const webpack = api.caller(isWebpack);

    return webpack
        ? {
            presets: [ // for build:less
                '@babel/preset-env',
                '@babel/preset-react'
            ]
        }
        : { // for build:lib
            "env": {
                "commonjs": {
                    sourceMaps: process.env.NODE_ENV === 'production' ? undefined : 'inline',
                    "presets": [
                        ["@babel/preset-env", {
                            "targets": {
                                "browsers": ["last 1 versions", "ie >= 10"]
                            },
                            "loose": true,
                            "useBuiltIns": 'usage',
                            "corejs": 3
                        }],
                        "@babel/preset-react"
                    ],
                }
            },
            "presets": [
                ["@babel/preset-env", {
                    "targets": {
                        "browsers": ["last 1 versions", "ie >= 10"]
                    },
                    "modules": false, // compile es module
                    "loose": true,
                    "useBuiltIns": 'usage',
                    "corejs": 3
                }],
                "@babel/preset-react"
            ],
            plugins: [
                'add-module-exports',
                [
                    '@babel/plugin-transform-runtime',
                    {
                        regenerator: true,
                        corejs: 3
                    }
                ],
                ['@babel/plugin-proposal-class-properties', {
                    "loose": true
                }],
                [
                    'babel-plugin-transform-remove-imports',
                    {
                        test: '\\.(less|css)$'
                    }
                ]
            ]
        };
};