# 🤝 Contributing to n8n MCP Server

Thank you for your interest in contributing to the n8n MCP Server! We welcome contributions from the community and appreciate your help in making this project better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Access to an n8n instance for testing

### Setting Up Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/n8n-mcp-server.git
   cd n8n-mcp-server
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your n8n configuration
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Run tests** to ensure everything works:
   ```bash
   npm test
   ```

## 💻 Development Process

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch (if needed for complex features)
- `feature/feature-name` - Feature branches
- `bugfix/bug-description` - Bug fix branches
- `hotfix/urgent-fix` - Urgent production fixes

### Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [coding standards](#coding-standards)

3. Add tests for your changes

4. Run the test suite:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

5. Commit your changes with a descriptive message:
   ```bash
   git commit -m "feat: add workflow template support"
   ```

6. Push to your fork and create a pull request

## 🔄 Pull Request Process

### Before Submitting

- [ ] Tests pass locally (`npm test`)
- [ ] Code follows style guidelines (`npm run lint`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Documentation is updated if needed
- [ ] Commit messages follow [Conventional Commits](https://conventionalcommits.org/)

### PR Requirements

1. **Fill out the PR template** completely
2. **Link related issues** using keywords (e.g., "Fixes #123")
3. **Provide clear description** of changes and motivation
4. **Include screenshots** for UI changes (if applicable)
5. **Update documentation** if the change affects usage

### Review Process

- All PRs require at least one approval from a maintainer
- Changes may be requested before merging
- CI checks must pass
- Keep PRs focused and reasonably sized

## 🐛 Issue Guidelines

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Check the documentation and README
- Try to reproduce the issue with the latest version

### Bug Reports

Use the bug report template and include:

- **Environment details** (Node.js version, OS, n8n version)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Error messages** or logs
- **Minimal reproducible example** if possible

### Feature Requests

Use the feature request template and include:

- **Problem description** - what you're trying to solve
- **Proposed solution** - your suggested approach
- **Alternatives considered** - other solutions you've thought about
- **Use case** - real-world scenario where this would be useful

## 🎨 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing code style (enforced by ESLint/Prettier)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer async/await over Promises
- Use strict TypeScript configuration

### Code Organization

- Keep functions small and focused
- Use appropriate abstractions
- Follow single responsibility principle
- Maintain consistent file structure
- Export only what's necessary

### Commit Messages

We use [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat(workflows): add workflow template support
fix(client): handle network timeout errors
docs(readme): update installation instructions
```

## 🧪 Testing

### Test Types

- **Unit tests** - Test individual functions and components
- **Integration tests** - Test n8n API interactions
- **End-to-end tests** - Test complete workflows

### Writing Tests

- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test both success and error cases
- Aim for good test coverage

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📚 Documentation

### Types of Documentation

- **API documentation** - JSDoc comments in code
- **User guides** - How to use the MCP server
- **Developer guides** - How to contribute and extend
- **Examples** - Sample workflows and configurations

### Documentation Standards

- Use clear, concise language
- Include code examples where helpful
- Keep documentation up-to-date with code changes
- Use proper markdown formatting
- Test all code examples

## 🏷️ Labeling

We use GitHub labels to categorize issues and PRs:

- **Type**: `bug`, `feature`, `enhancement`, `documentation`
- **Priority**: `critical`, `high`, `medium`, `low`
- **Status**: `needs-review`, `work-in-progress`, `blocked`
- **Area**: `n8n-client`, `mcp-server`, `handlers`, `tests`

## 🎉 Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes for significant contributions
- Special thanks in documentation

## ❓ Getting Help

If you need help:

1. Check the [documentation](README.md)
2. Search [existing issues](https://github.com/ddnetters/n8n-mcp-server/issues)
3. Create a new issue with the "question" label
4. Join discussions in issues and PRs

## 📞 Contact

For questions about contributing, please:

- Open a GitHub issue
- Start a GitHub discussion
- Contact the maintainers directly (if urgent)

Thank you for contributing to n8n MCP Server! 🚀