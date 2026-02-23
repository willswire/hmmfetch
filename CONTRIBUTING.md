# Contributing to hmmfetch

Thanks for considering contributing to hmmfetch!

## Development Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests with `npm test`
5. Submit a pull request

## Pull Requests

- Ensure your code passes all tests
- Update documentation as necessary
- Include tests for new features
- Keep your PR focused on a single topic
- Follow the existing code style

## Testing

To run tests:

```bash
npm test
```

To run tests with coverage report:

```bash
npm run test:coverage
```

## Releasing (for maintainers)

1. Update version in package.json
2. Commit changes
3. Tag the release: `git tag v1.x.x`
4. Push with tags: `git push --follow-tags`
5. The GitHub Action will automatically publish to npm

## License

By contributing, you agree that your contributions will be licensed under the project's ISC license.