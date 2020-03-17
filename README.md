[![Travis master](https://img.shields.io/travis/neoskop/pulumi-utils/master.svg)](https://travis-ci.org/neoskop/pulumi-utils)
[![Coverage Status](https://coveralls.io/repos/github/neoskop/pulumi-utils/badge.svg)](https://coveralls.io/github/neoskop/pulumi-utils)
[![Snyk master](https://snyk.io/test/github/neoskop/pulumi-utils/master/badge.svg)](https://snyk.io/test/github/neoskop/pulumi-utils/master)

## Project Structure

This repository uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) and contains four submodules which integrate with each other:

### Common

[![NPM version][npm-badge-common]][npm-link-common][![License][licence-common]][licence-link]

A collection of utilities useful in SDK and plugin development.
[See readme](./modules/common) for details.

### GRPC

[![NPM version][npm-badge-grpc]][npm-link-grpc][![License][licence-grpc]][licence-link]

Generated server and client code for [pulumi protobuf format](https://github.com/pulumi/pulumi/tree/master/sdk/proto).
[See readme](./modules/grpc) for details.

### Plugin

[![NPM version][npm-badge-plugin]][npm-link-plugin][![License][licence-plugin]][licence-link]

A library to create plugins for pulumi.
[See readme](./modules/plugin) for details.

### SDK

[![NPM version][npm-badge-sdk]][npm-link-sdk][![License][licence-sdk]][licence-link]

A collection of helper utilities for SDK development.
[See readme](./modules/sdk) for details.

## License

[MIT][licence-link]

[npm-badge-common]: https://img.shields.io/npm/v/@neoskop/pulumi-utils-common
[npm-link-common]: https://npmjs.com/package/@neoskop/pulumi-utils-common
[npm-badge-grpc]: https://img.shields.io/npm/v/@neoskop/pulumi-utils-grpc
[npm-link-grpc]: https://npmjs.com/package/@neoskop/pulumi-utils-grpc
[npm-badge-plugin]: https://img.shields.io/npm/v/@neoskop/pulumi-utils-plugin
[npm-link-plugin]: https://npmjs.com/package/@neoskop/pulumi-utils-plugin
[npm-badge-sdk]: https://img.shields.io/npm/v/@neoskop/pulumi-utils-sdk
[npm-link-sdk]: https://npmjs.com/package/@neoskop/pulumi-utils-sdk
[licence-link]: https://github.com/neoskop/pulumi-utils/blob/master/LICENSE
[licence-common]: https://img.shields.io/npm/l/%40neoskop%2Fpulumi-utils-common.svg
[licence-grpc]: https://img.shields.io/npm/l/%40neoskop%2Fpulumi-utils-grpc.svg
[licence-plugin]: https://img.shields.io/npm/l/%40neoskop%2Fpulumi-utils-plugin.svg
[licence-sdk]: https://img.shields.io/npm/l/%40neoskop%2Fpulumi-utils-sdk.svg
