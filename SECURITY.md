# 🔒 Security Policy

## 🛡️ Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## 🚨 Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 📧 Private Disclosure

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues privately by:

1. **Email**: Send details to the project maintainers
2. **GitHub Security**: Use GitHub's private vulnerability reporting feature
3. **Response Time**: We aim to respond within 48 hours

### 📋 What to Include

When reporting a vulnerability, please include:

- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Potential impact** assessment
- **Suggested fix** (if you have one)
- **Your contact information** for follow-up

### 🔄 Process

1. **Acknowledgment**: We'll acknowledge receipt within 48 hours
2. **Investigation**: We'll investigate and assess the impact
3. **Fix Development**: We'll develop and test a fix
4. **Disclosure**: We'll coordinate disclosure timeline with you
5. **Release**: We'll release the fix and security advisory

## 🛡️ Security Best Practices

### For Users

- **Keep Updated**: Always use the latest version
- **Secure Configuration**: Follow security guidelines in documentation
- **API Keys**: Store API keys securely, never commit them to version control
- **Environment Variables**: Use environment variables for sensitive configuration
- **Network Security**: Ensure secure network connections to n8n instances

### For Contributors

- **Dependencies**: Keep dependencies updated and audit regularly
- **Input Validation**: Validate all inputs from external sources
- **Error Handling**: Don't expose sensitive information in error messages
- **Authentication**: Implement proper authentication and authorization
- **Logging**: Avoid logging sensitive information

## 🔍 Security Measures

This project implements several security measures:

- **Input Validation**: All inputs are validated using Zod schemas
- **API Authentication**: Secure API key authentication with n8n
- **Error Handling**: Sanitized error messages that don't expose internals
- **Dependencies**: Regular dependency updates and security audits
- **TypeScript**: Strong typing helps prevent many security issues

## 🚫 Out of Scope

The following are generally not considered security vulnerabilities:

- Issues requiring local access to the machine
- Social engineering attacks
- Physical attacks
- Denial of service attacks requiring excessive resources
- Issues in third-party dependencies (report to the respective projects)

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)

## 🙏 Acknowledgments

We appreciate security researchers and users who help keep this project secure by responsibly disclosing vulnerabilities.